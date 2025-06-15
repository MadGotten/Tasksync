import { cloneElement, memo, useEffect } from "react";
import { createPortal } from "react-dom";
import { IconButton } from "@/components/ui";
import { useModal } from "@/hooks/useModal";

type ModalProps = {
  children: React.ReactNode | ((utils: { close: () => void }) => React.ReactNode);
  triggerButton: React.ReactElement<React.ButtonHTMLAttributes<HTMLButtonElement>>;
  title: string;
  isDone?: boolean;
  disable?: boolean;
  onSubmit?: (e: React.FormEvent<HTMLFormElement>) => void;
  onOpenChange?: (open: boolean) => void;
  onDone?: VoidFunction;
};

export const Modal = ({
  children,
  triggerButton,
  isDone,
  title,
  disable = false,
  onSubmit,
  onOpenChange,
}: ModalProps) => {
  const { modalRef, open, isOpen, close } = useModal({ disable, onOpenChange });

  useEffect(() => {
    if (isDone) {
      const timer = setTimeout(() => {
        close();
      }, 100);

      return () => clearTimeout(timer);
    }
  }, [isDone, close]);

  useEffect(() => {
    if (modalRef.current) {
      const modalElement = modalRef.current;
      const focusableElements = modalElement.querySelectorAll<HTMLElement>(
        "a, button, textarea, input, select"
      );

      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];

      const handleKeyDown = (event: KeyboardEvent) => {
        if (event.key === "Tab") {
          if (event.shiftKey && document.activeElement === firstElement) {
            event.preventDefault();
            lastElement.focus();
          } else if (!event.shiftKey && document.activeElement === lastElement) {
            event.preventDefault();
            firstElement.focus();
          }
        }
      };

      modalElement.addEventListener("keydown", handleKeyDown);
      return () => {
        modalElement.removeEventListener("keydown", handleKeyDown);
      };
    }
  }, [modalRef, isOpen]);

  return (
    <>
      <TriggerButton open={open}>{triggerButton}</TriggerButton>

      {isOpen &&
        createPortal(
          <>
            <div onPointerDown={(event) => event.stopPropagation()} className='overlay'></div>
            <div
              onPointerDown={(event) => event.stopPropagation()}
              role='dialog'
              aria-modal='true'
              className='modal'
              ref={modalRef}
            >
              <div className='modal-header'>
                <div className='modal-title'>{title}</div>
                <IconButton
                  className='modal-close'
                  variant='ghost'
                  size='icon'
                  icon='material-symbols:close'
                  onClick={close}
                />
              </div>
              <form onSubmit={onSubmit} className='form-group'>
                {typeof children === "function" ? children({ close }) : children}
              </form>
            </div>
          </>,
          document.body
        )}
    </>
  );
};

const TriggerButton = memo(
  ({
    children,
    open,
  }: {
    children: React.ReactElement<React.ButtonHTMLAttributes<HTMLButtonElement>>;
    open: VoidFunction;
  }) => {
    return cloneElement(children, {
      onClick: open,
    });
  }
);

TriggerButton.displayName = "TriggerButton";
