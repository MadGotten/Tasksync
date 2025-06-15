import { Link } from "@tanstack/react-router";
import styles from "./ErrorPage.module.css";
import { Plane } from "@/components/ui";

export const ErrorPage = () => {
  return (
    <Plane>
      <div className={styles.errorPage}>
        <div className={styles.errorContent}>
          <h1>404 - Page Not Found</h1>
          <div className={styles.errorDetails}>
            <p className={styles.helperText}>The page you are looking for does not exist.</p>
            <Link to={"/"} className={styles.homeLink}>
              Go back to Home
            </Link>
          </div>
        </div>
      </div>
    </Plane>
  );
};
