"use client";

import { useEffect, useRef } from "react";
import "@/styles/components/editor/editor.css"

let EditorJS;

const detectScriptMode = (text) => {
  if (!text) return null;
  const faMatches =
    text.match(/[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF]/g) || [];
  const enMatches = text.match(/[A-Za-z]/g) || [];
  const faCount = faMatches.length;
  const enCount = enMatches.length;
  if (faCount === 0 && enCount === 0) return null;
  return faCount >= enCount ? "rtl" : "ltr";
};

/** debounce برای جلوگیری از اجرای زیاد تابع */
const debounce = (fn, wait = 120) => {
  let t;
  return (...args) => {
    clearTimeout(t);
    t = setTimeout(() => fn(...args), wait);
  };
};

const Editor = ({ initialData, onReady }) => {
  const instanceRef = useRef(null);

  useEffect(() => {
    let mounted = true;

    /** اعمال RTL/LTR روی یک بلاک */
    const applyDirectionToBlock = (el) => {
      if (!el) return;
      const txt = el.innerText || el.textContent || "";
      const mode = detectScriptMode(txt);
      el.classList.toggle("rtl", mode === "rtl");
      el.classList.toggle("ltr", mode === "ltr");
    };

    /** اعمال RTL/LTR روی همه بلاک‌ها */
    const applyDirectionToAllBlocks = () => {
      const holder = document.getElementById("editorjs");
      if (!holder) return;
      const blocks = holder.querySelectorAll(
        ".ce-block, .ce-paragraph, .ce-header"
      );
      blocks.forEach(applyDirectionToBlock);
    };

    /** راه‌اندازی Editor.js */
    const loadEditor = async () => {
      const EditorModule = await import("@editorjs/editorjs");
      const Header = (await import("@editorjs/header")).default;
      const List = (await import("@editorjs/list")).default;
      const Quote = (await import("@editorjs/quote")).default;
      const Marker = (await import("@editorjs/marker")).default;
      const Embed = (await import("@editorjs/embed")).default;
      const Code = (await import("@editorjs/code")).default;
      const Table = (await import("@editorjs/table")).default;
      const Delimiter = (await import("@editorjs/delimiter")).default;
      const Underline = (await import("@editorjs/underline")).default;
      const InlineCode = (await import("@editorjs/inline-code")).default;
      const SimpleImage = (await import("@editorjs/simple-image")).default;

      EditorJS = EditorModule.default;

      if (!instanceRef.current && mounted) {
        instanceRef.current = new EditorJS({
          holder: "editorjs",
          placeholder: "اینجا تایپ کن...",
          autofocus: true,
          data: initialData || undefined,
          tools: {
            header: Header,
            list: List,
            quote: Quote,
            marker: { class: Marker, shortcut: "CMD+SHIFT+M" },
            embed: Embed,
            code: Code,
            table: Table,
            delimiter: Delimiter,
            underline: Underline,
            inlineCode: InlineCode,
            image: SimpleImage,
          },
          onReady: () => {
            applyDirectionToAllBlocks();

            const holder = document.getElementById("editorjs");
            if (!holder) return;

            const observer = new MutationObserver((mutations) => {
              mutations.forEach((m) => {
                // بلاک جدید اضافه شده
                m.addedNodes.forEach((node) => {
                  if (
                    node.nodeType === 1 &&
                    node.classList.contains("ce-block")
                  ) {
                    applyDirectionToBlock(node);
                  }
                });

                // تغییر متن موجود
                if (m.type === "characterData") {
                  // اگر target یک Text Node است، از parentElement استفاده کن
                  const targetEl =
                    m.target.nodeType === 1 ? m.target : m.target.parentElement;
                  const block = targetEl?.closest(
                    ".ce-block, .ce-paragraph, .ce-header"
                  );
                  if (block) applyDirectionToBlock(block);
                }
              });
            });

            observer.observe(holder, {
              subtree: true,
              childList: true,
              characterData: true,
            });

            instanceRef.current._directionObserver = observer;

            if (typeof onReady === "function") {
              onReady(instanceRef.current);
            }
          },
        });
      }
    };

    loadEditor();

    return () => {
      mounted = false;

      if (instanceRef.current?._directionObserver) {
        instanceRef.current._directionObserver.disconnect();
        instanceRef.current._directionObserver = null;
      }

      if (instanceRef.current?.destroy) {
        instanceRef.current.destroy();
        instanceRef.current = null;
      }
    };
  }, []);

  return <div id="editorjs" className="editor" />;
};

export default Editor;
