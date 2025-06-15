import { Icon } from "@iconify-icon/react";
import Button, { ButtonProps } from "./Button";

interface IconButtonProps extends Omit<ButtonProps, "children"> {
  children?: React.ReactNode;
  icon: string;
  iconPosition?: "left" | "right";
  iconSize?: number;
}

const IconButton: React.FC<IconButtonProps> = ({
  children,
  icon,
  iconPosition = "left",
  iconSize = 24,
  ...props
}) => {
  return (
    <Button {...props}>
      {iconPosition === "left" && <Icon icon={icon} width={iconSize} height={iconSize} />}
      {children}
      {iconPosition === "right" && <Icon icon={icon} width={iconSize} height={iconSize} />}
    </Button>
  );
};

export default IconButton;
