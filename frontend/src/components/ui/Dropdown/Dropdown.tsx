import { useDropdown } from "@/hooks/useDropdown";
import { cloneElement, memo, useEffect } from "react";
import { createPortal } from "react-dom";
import styles from "./Dropdown.module.css";

type DropdownProps = {
  dropdownOpen?: boolean;
  children: React.ReactNode;
  triggerButton: React.ReactElement<React.ButtonHTMLAttributes<HTMLButtonElement>>;
  hidden?: boolean;
  onOpenChange?: (open: boolean) => void;
  orientation?: "left" | "right";
  topOffset?: number;
};

type OptionProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  children: React.ReactElement;
  asChild?: boolean;
  variant?: "default" | "danger";
};

const Dropdown = ({
  dropdownOpen,
  children,
  triggerButton,
  hidden,
  onOpenChange,
  orientation = "right",
  topOffset = 4,
}: DropdownProps) => {
  const { isOpen, toggle, close, modalRef, triggerRef } = useDropdown({
    disable: hidden,
    onOpenChange,
  });

  // If orientation is right, we take the width of the dropdown and substract it by the width of the trigger button
  // If orientation is left, we leave the default offset of 0
  const orientationOffset =
    orientation === "right" ? 0 : 150 - (triggerRef.current?.getBoundingClientRect().width ?? 0);

  const offsets = {
    top:
      (triggerRef.current?.getBoundingClientRect().top ?? 0) +
      (triggerRef.current?.getBoundingClientRect().height ?? 0) +
      topOffset,
    left: (triggerRef.current?.getBoundingClientRect().left ?? 0) - orientationOffset,
  };

  const dropdownSettings: React.CSSProperties = {
    top: offsets.top,
    left: offsets.left,
    visibility: hidden ? "hidden" : "visible",
  };

  // Synchronize internal dropdown state with external dropdown/modal state
  useEffect(() => {
    if (isOpen && !dropdownOpen) {
      close();
    }
  }, [dropdownOpen, isOpen, close]);

  return (
    <>
      <TriggerButton open={toggle} ref={triggerRef}>
        {triggerButton}
      </TriggerButton>
      {isOpen &&
        dropdownOpen &&
        createPortal(
          <div
            ref={modalRef}
            style={dropdownSettings}
            data-orientation={orientation}
            className={styles.root}
          >
            <div className={styles.content}>{children}</div>
          </div>,
          document.body
        )}
    </>
  );
};

const Option: React.FC<OptionProps> = memo(
  ({ children, asChild = false, variant = "default", ...props }) => {
    const classNames = [styles.option, styles[`option-${variant}`]].filter(Boolean).join(" ");

    if (asChild) {
      const child = children as React.ReactElement<any>;
      return cloneElement(child, {
        triggerWrapper: (children: React.ReactElement) => (
          <button className={classNames} {...props}>
            {children}
          </button>
        ),
        ...props,
      });
    }

    return (
      <button className={classNames} {...props}>
        {children}
      </button>
    );
  }
);

const TriggerButton = memo(
  ({
    children,
    open,
    ref,
  }: {
    children: React.ReactElement<any>;
    open: VoidFunction;
    ref: React.RefObject<any>;
  }) => {
    return cloneElement(children, {
      onClick: open,
      ref: ref,
    });
  }
);

Dropdown.Option = Option;

Dropdown.displayName = "Dropdown";
Option.displayName = "DropdownOption";
TriggerButton.displayName = "DropdownTriggerButton";

export default Dropdown;
