"use client"
import { useState, useEffect } from "react";
import styles from "@/styles/docs/docs.module.css";
import { FaFolder, FaFileAlt, FaArrowLeft } from "react-icons/fa";
import { useRouter } from "next/navigation";

const Documents = () => {
  const router = useRouter();
  const [currentFolder, setCurrentFolder] = useState(null);
  const [folders, setFolders] = useState([]);
  const [documents, setDocuments] = useState([]);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/api/folders");
        const data = await res.json();
        if (data.ok) setFolders(data.folders);
      } catch (err) {
        console.error(err);
      }
    })();
  }, []);

  const openFolder = async (folder) => {
    setCurrentFolder(folder);
    try {
      const res = await fetch(`/api/folders/${folder.id}/documents`);
      const data = await res.json();
      if (data.ok) setDocuments(data.documents);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className={styles.container}>
      {!currentFolder ? (
        <div className={styles.grid}>
          {folders.map((folder) => (
            <div
              key={folder.id}
              className={styles.card}
              onClick={() => openFolder(folder)}
            >
              <FaFolder className={styles.iconFolder} />
              <span>{folder.name}</span>
            </div>
          ))}
        </div>
      ) : (
        <div className={styles.grid}>
          <div
            className={`${styles.card} ${styles.backBtn}`}
            onClick={() => setCurrentFolder(null)}
          >
            <FaArrowLeft className={styles.iconBack} />
            <span>Back</span>
          </div>
          {documents.map((doc) => (
            <div key={doc.id} className={styles.card} onClick={() => router.push(`/docs/${doc.id}`)}>
              <FaFileAlt className={styles.iconDoc} />
              <span>{doc.title}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Documents;
