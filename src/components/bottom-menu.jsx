"use client";
import styles from "@/styles/components/bottom-menu/bottom-menu.module.css";
import { useRouter } from "next/navigation";
import useMessage from "@/hook/useMessage";
import {
  FaHome,
  FaPlusCircle,
  FaFileAlt,
  FaUserCircle,
  FaSignOutAlt,
} from "react-icons/fa";

const BottomMenu = () => {
  const router = useRouter();
  const { successMessage, errorMessage, contextHolder } = useMessage();

  const go = (path) => () => router.push(path);

  const handleLogout = async () => {
    try {
      const res = await fetch("/api/auth/logout", { method: "POST" });
      if (res.ok) {
        successMessage("Logged out");
        router.push("/login");
      } else {
        errorMessage("Logout failed");
      }
    } catch (e) {
      errorMessage("Logout failed");
    }
  };

  return (
    <div className={styles["bottom-menu"]}>
      {contextHolder}
      <div className={styles["menu-item"]} onClick={go("/")}>
        <FaHome className={styles["menu-icon"]} />
        <span>Home</span>
      </div>
      <div className={styles["menu-item"]} onClick={go("/add")}>
        <FaPlusCircle className={styles["menu-icon"]} />
        <span>Add</span>
      </div>
      <div className={styles["menu-item"]} onClick={go("/docs")}>
        <FaFileAlt className={styles["menu-icon"]} />
        <span>Documents</span>
      </div>
      <div className={styles["menu-item"]} onClick={handleLogout}>
        <FaSignOutAlt className={styles["menu-icon"]} />
        <span>LogOut</span>
      </div>
    </div>
  );
};

export default BottomMenu;
