import styles from "./NavbarDropdown.module.css";
import { keycloak } from "@/api/keycloak";

export function NavbarDropdown({ ref }: { ref: React.RefObject<HTMLDivElement | null> }) {
  const handleLogout = () => {
    keycloak.logout({ redirectUri: window.location.origin });
  };

  const handleAccountManagement = () => {
    keycloak.accountManagement();
  };

  return (
    <div ref={ref} className={styles.dropdown}>
      <div className={`${styles.group} ${styles["group-border"]}`}>
        <div className={styles["group-name"]}>Account</div>
        <button onClick={handleAccountManagement} className={styles.option}>
          Your account
        </button>
        <div className={styles.option}>Change account</div>
      </div>
      <div className={styles.group}>
        <div className={styles["group-name"]}>TaskSync</div>
        <div className={styles.option}>Tables</div>
        <div className={styles.option}>Activity</div>
        <button onClick={handleLogout} className={styles.option}>
          Logout
        </button>
      </div>
    </div>
  );
}
