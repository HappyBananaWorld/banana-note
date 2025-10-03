"use client"
import { useState } from "react";
import styles from "@/styles/add/add.module.css";

const Add = () => {
  const [type, setType] = useState(null); // "folder" or "document"
  const [folderName, setFolderName] = useState("");
  const [docTitle, setDocTitle] = useState("");
  const [selectedFolder, setSelectedFolder] = useState("");

  const folders = ["Ideas", "English Quotes", "Tasks", "Goals"];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (type === "folder") {
      alert(`New Folder: ${folderName}`);
    } else if (type === "document") {
      alert(`New Document: ${docTitle} in ${selectedFolder}`);
    }
  };

  return (
    <div className={styles.container}>
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
                {folders.map((f, i) => (
                  <option key={i} value={f}>
                    {f}
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
