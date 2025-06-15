import React from "react";
import styles from "./Button.module.css";
import { SpinnerIcon } from "@/assets/icons";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  type?: "button" | "submit" | "reset";
  size?: "icon" | "xs" | "sm" | "md" | "lg" | "xl";
  variant?: "outline" | "primary" | "danger" | "success" | "ghost";
  fs?: "xs" | "sm" | "md" | "lg" | "xl";
  fw?: "400" | "500" | "600";
  full?: boolean;
  ref?: React.RefObject<HTMLButtonElement>;
  isLoading?: boolean;
  rounded?: "none" | "sm" | "md" | "lg" | "full";
}

const Button: React.FC<ButtonProps> = ({
  children,
  type = "button",
  size = "md",
  variant = "outline",
  rounded = "md",
  fs = "md",
  fw = "500",
  ref,
  isLoading = false,
  full = false,
  className,
  disabled,
  ...props
}) => {
  const classNames = [
    styles.button,
    styles[size],
    styles[variant],
    styles[`fs-${fs}`],
    styles[`fw-${fw}`],
    styles[`rounded-${rounded}`],
    full ? styles.full : "",
    className || "",
  ]
    .filter(Boolean)
    .join(" ");

  const isDisabled = disabled || isLoading;

  return (
    <button {...props} ref={ref} type={type} disabled={isDisabled} className={classNames}>
      {isLoading ? <SpinnerIcon /> : children}
    </button>
  );
};

export default Button;
