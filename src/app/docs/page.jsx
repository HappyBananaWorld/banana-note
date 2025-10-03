"use client"
import { useState } from "react";
import styles from "@/styles/docs/docs.module.css";
import { FaFolder, FaFileAlt, FaArrowLeft } from "react-icons/fa";

const Documents = () => {
  const [currentFolder, setCurrentFolder] = useState(null);

  const folders = {
    "Ideas": ["Startup Plan", "App Concept", "Marketing Strategy"],
    "English Quotes": ["Motivation Quote 1", "Success Quote 2"],
    "Tasks": ["Task List - Monday", "Project Roadmap", "Bug Fixes"],
    "Goals": ["2025 Goals", "Personal Development", "Fitness Plan"]
  };

  return (
    <div className={styles.container}>
      {!currentFolder ? (
        <div className={styles.grid}>
          {Object.keys(folders).map((folder) => (
            <div
              key={folder}
              className={styles.card}
              onClick={() => setCurrentFolder(folder)}
            >
              <FaFolder className={styles.iconFolder} />
              <span>{folder}</span>
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
          {folders[currentFolder].map((doc, index) => (
            <div key={index} className={styles.card}>
              <FaFileAlt className={styles.iconDoc} />
              <span>{doc}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Documents;
