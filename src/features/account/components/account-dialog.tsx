"use client";
import {
  useEffect,
  useId,
  useRef,
  type CSSProperties,
  type ReactNode,
} from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";

export function AccountDialog({
  title,
  children,
  onClose,
  anchor,
}: {
  title: string;
  children: ReactNode;
  onClose: () => void;
  anchor?: { top: number; right: number };
}) {
  const ref = useRef<HTMLDialogElement>(null);
  const titleId = useId();
  useEffect(() => {
    const opener = document.activeElement;
    const dialog = ref.current;
    dialog?.showModal();
    return () => {
      dialog?.close();
      if (opener instanceof HTMLElement && opener.isConnected) opener.focus();
    };
  }, []);
  return (
    <dialog
      ref={ref}
      className={`account-dialog${anchor ? " account-popover" : ""}`}
      style={
        anchor
          ? ({
              "--account-top": `${anchor.top}px`,
              "--account-right": `${anchor.right}px`,
            } as CSSProperties)
          : undefined
      }
      aria-labelledby={titleId}
      onCancel={(event) => {
        event.preventDefault();
        onClose();
      }}
      onClick={(e) => {
        if (e.target !== e.currentTarget) return;
        const r = e.currentTarget.getBoundingClientRect();
        if (
          e.clientX < r.left ||
          e.clientX > r.right ||
          e.clientY < r.top ||
          e.clientY > r.bottom
        )
          onClose();
      }}
    >
      <header>
        <h2 id={titleId}>{title}</h2>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          aria-label="Cerrar"
          onClick={onClose}
        >
          <X size={20} />
        </Button>
      </header>
      {children}
    </dialog>
  );
}
