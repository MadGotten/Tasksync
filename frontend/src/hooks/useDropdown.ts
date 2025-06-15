import { useState, useRef, useEffect, useCallback } from "react";

interface UseDropdownOptions {
  initialOpen?: boolean;
  closeOnEscape?: boolean;
  closeOnOutsideClick?: boolean;
  disable?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export const useDropdown = (options: UseDropdownOptions = {}) => {
  const {
    initialOpen = false,
    closeOnEscape = true,
    closeOnOutsideClick = true,
    disable = false,
    onOpenChange,
  } = options;

  const [isOpen, setIsOpen] = useState(initialOpen);
  const modalRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLElement>(null);

  const open = useCallback(() => {
    setIsOpen(true);
    onOpenChange?.(true);
  }, [onOpenChange]);
  const close = useCallback(() => {
    setIsOpen(false);
    onOpenChange?.(false);
  }, [onOpenChange]);
  const toggle = useCallback(() => {
    setIsOpen((prev) => !prev);
    onOpenChange?.(!isOpen);
  }, [onOpenChange, isOpen]);

  useEffect(() => {
    if (!isOpen || disable) return;

    const handleEscapeKey = (event: KeyboardEvent) => {
      if (closeOnEscape && event.key === "Escape") {
        close();
      }
    };

    const handleClickOutside = (event: MouseEvent) => {
      if (!closeOnOutsideClick) return;

      if (
        modalRef.current &&
        !modalRef.current.contains(event.target as Node) &&
        triggerRef.current &&
        !triggerRef.current.contains(event.target as Node)
      ) {
        close();
      }
    };

    document.addEventListener("keydown", handleEscapeKey);
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("keydown", handleEscapeKey);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, disable, closeOnEscape, closeOnOutsideClick]);

  return {
    isOpen,
    open,
    close,
    toggle,
    modalRef,
    triggerRef,
  };
};
