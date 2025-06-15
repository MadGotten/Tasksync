import styles from "./Plane.module.css";

interface PlaneProps {
  children: React.ReactNode;
  full?: boolean;
  props?: Omit<HTMLDivElement, "className">;
}

interface HeaderProps {
  children: React.ReactNode;
}

const Plane = ({ children, full = false, ...props }: PlaneProps) => {
  return (
    <div className={`${styles.plane} ${full && styles.plane__full}`} {...props}>
      {children}
    </div>
  );
};

const Header = ({ children }: HeaderProps) => {
  return <div className={styles["plane-header"]}>{children}</div>;
};

const Title = ({ children }: HeaderProps) => {
  return <h2 className={styles["plane-title"]}>{children}</h2>;
};

const Icons = ({ children }: HeaderProps) => {
  return <div className={styles["plane-icons"]}>{children}</div>;
};

Plane.Header = Header;
Plane.Title = Title;
Plane.Icons = Icons;

export default Plane;
