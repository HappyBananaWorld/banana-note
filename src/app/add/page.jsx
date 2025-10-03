"use client";
import { useState, useEffect } from "react";
import styles from "@/styles/add/add.module.css";
import useMessage from "@/hook/useMessage";

const Add = () => {
  const [type, setType] = useState(null);
  const [folderName, setFolderName] = useState("");
  const [docTitle, setDocTitle] = useState("");
  const [selectedFolder, setSelectedFolder] = useState("");
  const [folders, setFolders] = useState([]);
  const { successMessage, errorMessage, warningMessage, contextHolder } = useMessage();

  useEffect(() => {
    fetchFolders();
  }, []);

  const fetchFolders = async () => {
    try {
      const res = await fetch("/api/folders");
      const data = await res.json();
      if (data.ok) setFolders(data.folders);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (type === "folder") {
        const res = await fetch("/api/add/folder", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name: folderName }),
        });
        const data = await res.json();
        if (data.ok) {
          successMessage(`Folder "${data.folder.name}" created!`);
          setFolderName("");
          fetchFolders();
        }
      } else if (type === "document") {
        const folderId = folders.find((f) => f.name === selectedFolder)?.id;
        if (!folderId) return warningMessage("Select a valid folder");

        const res = await fetch("/api/add/document", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ title: docTitle, folderId }),
        });
        const data = await res.json();
        if (data.ok) {
          successMessage(`Document "${data.document.title}" created in "${selectedFolder}"`);
          setDocTitle("");
          setSelectedFolder("");
        }
      }
      setType(null);
    } catch (err) {
      console.error(err);
      errorMessage("Something went wrong!");
    }
  };

  return (
    <div className={styles.container}>
      {contextHolder}
      {!type && (
        <div className={styles.cardWrapper}>
          <div className={styles.card} onClick={() => setType("folder")}>
            <span className={styles.cardTitle}>Create Folder</span>
          </div>
          <div className={styles.card} onClick={() => setType("document")}>
            <span className={styles.cardTitle}>Create Document</span>
          </div>
        </div>
      )}

      {type && (
        <form className={styles.form} onSubmit={handleSubmit}>
          {type === "folder" && (
            <>
              <label>Folder Name:</label>
              <input
                type="text"
                value={folderName}
                onChange={(e) => setFolderName(e.target.value)}
                required
              />
            </>
          )}

          {type === "document" && (
            <>
              <label>Document Title:</label>
              <input
                type="text"
                value={docTitle}
                onChange={(e) => setDocTitle(e.target.value)}
                required
              />

              <label>Select Folder:</label>
              <select
                value={selectedFolder}
                onChange={(e) => setSelectedFolder(e.target.value)}
                required
              >
                <option value="">-- Choose Folder --</option>
                {folders.map((f) => (
                  <option key={f.id} value={f.name}>
                    {f.name}
                  </option>
                ))}
              </select>
            </>
          )}

          <div className={styles.actions}>
            <button type="submit" className={styles.btn}>
              Save
            </button>
            <button
              type="button"
              className={styles.btnCancel}
              onClick={() => setType(null)}
            >
              Cancel
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default Add;
