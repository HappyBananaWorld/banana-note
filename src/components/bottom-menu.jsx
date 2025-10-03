import styles from "@/styles/components/bottom-menu/bottom-menu.module.css";
import {
  FaHome,
  FaPlusCircle,
  FaFileAlt,
  FaUserCircle,
  FaSignOutAlt,
} from "react-icons/fa";

const BottomMenu = () => {
  return (
    <div className={styles["bottom-menu"]}>
      <div className={styles["menu-item"]}>
        <FaHome className={styles["menu-icon"]} />
        <span>Home</span>
      </div>
      <div className={styles["menu-item"]}>
        <FaPlusCircle className={styles["menu-icon"]} />
        <span>Add</span>
      </div>
      <div className={styles["menu-item"]}>
        <FaFileAlt className={styles["menu-icon"]} />
        <span>Documents</span>
      </div>
      <div className={styles["menu-item"]}>
        <FaSignOutAlt className={styles["menu-icon"]} />
        <span>LogOut</span>
      </div>
    </div>
  );
};

export default BottomMenu;
