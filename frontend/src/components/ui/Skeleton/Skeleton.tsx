import styles from "./Skeleton.module.css";

interface SkeletonProps {
  width?: number;
  height?: number;
  variant?: "rounded" | "circle" | "rectangle";
}

interface SkeletonGroupProps {
  children: React.ReactNode;
  direction?: "row" | "column";
  gap?: number;
}

const Skeleton = ({ width, height, variant = "rectangle" }: SkeletonProps) => {
  const borderRadius = {
    rounded: "8px",
    circle: "50%",
    rectangle: "",
  }[variant];

  const style: React.CSSProperties = {
    width: width ? `${width}px` : "100%",
    minWidth: width ? `${width}px` : "",
    height: height ? `${height}px` : "100%",
    borderRadius,
  };

  return <div style={style} className={styles.skeleton}></div>;
};

const SkeletonGroup = ({ children, direction = "row", gap = 8 }: SkeletonGroupProps) => {
  const style: React.CSSProperties = {
    flexDirection: direction,
    gap: `${gap}px`,
  };
  return (
    <div style={style} className={styles.skeletonGroup}>
      {children}
    </div>
  );
};

Skeleton.Group = SkeletonGroup;

export default Skeleton;
