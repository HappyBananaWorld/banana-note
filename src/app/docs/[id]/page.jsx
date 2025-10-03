"use client"
import { useCallback, useEffect, useRef, useState } from "react";
import Editor from "@/components/editor";
import styles from "@/styles/docs/docs.module.css";
import useMessage from "@/hook/useMessage";

const DocEditorPage = ({ params }) => {
    const { id } = params;
    const editorRef = useRef(null);
    const [loading, setLoading] = useState(true);
    const [title, setTitle] = useState("");
    const [initialData, setInitialData] = useState(undefined);
    const [saving, setSaving] = useState(false);
    const { successMessage, errorMessage, contextHolder } = useMessage();

    useEffect(() => {
        let cancelled = false;
        (async () => {
            try {
                const res = await fetch(`/api/documents/${id}`);
                const data = await res.json();
                if (cancelled) return;
                if (data.ok) {
                    setTitle(data.document.title || "");
                    let parsed = null;
                    try {
                        parsed = data.document.content ? JSON.parse(data.document.content) : null;
                    } catch (_) {
                        parsed = null;
                    }
                    setInitialData(parsed || undefined);
                }
            } catch (err) {
                if (!cancelled) console.error(err);
            } finally {
                if (!cancelled) setLoading(false);
            }
        })();
        return () => {
            cancelled = true;
        };
    }, [id]);

    const handleSave = useCallback(async () => {
        if (!editorRef.current) return;
        setSaving(true);
        try {
            const output = await editorRef.current.save();
            const res = await fetch(`/api/documents/${id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ title, content: JSON.stringify(output) }),
            });
            const data = await res.json();
            if (data.ok) {
                successMessage("Saved");
            } else {
                errorMessage(data.error || "Save failed");
            }
        } catch (err) {
            console.error(err);
            errorMessage("Save failed");
        } finally {
            setSaving(false);
        }
    }, [id, title]);

    if (loading) return <div className={styles.container}>Loading...</div>;

    return (
        <div className={styles.container}>
            {contextHolder}
            <div className={styles.actions}>
                <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Title"
                    className={styles.titleInput}
                />
                <button onClick={handleSave} className={styles.btn} disabled={saving}>
                    {saving ? "Saving..." : "Save"}
                </button>
            </div>
            <Editor
                initialData={initialData}
                onReady={(inst) => {
                    editorRef.current = inst;
                }}
            />
        </div>
    );
};

export default DocEditorPage;


