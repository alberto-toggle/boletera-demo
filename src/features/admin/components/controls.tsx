"use client";
import { useId, type ReactNode } from "react";
import { Dialog } from "@base-ui/react/dialog";
import { X, Search, ChevronLeft, ChevronRight, Inbox } from "lucide-react";
import Link from "next/link";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
export function AdminSelect({
  label,
  value,
  options,
  onChange,
  disabled = false,
}: {
  disabled?: boolean;
  label: string;
  value: string;
  options: readonly { value: string; label: string }[];
  onChange: (value: string) => void;
}) {
  const id = useId();
  return (
    <Select
      disabled={disabled}
      value={value}
      onValueChange={(next) => {
        if (next !== null) onChange(next);
      }}
      items={options}
    >
      <SelectTrigger id={id} className="admin-select" aria-label={label}>
        <SelectValue />
      </SelectTrigger>
      <SelectContent
        align="start"
        className="admin-theme admin-select-popup"
        sideOffset={6}
        alignItemWithTrigger={false}
      >
        {options.map((option) => (
          <SelectItem key={option.value} value={option.value}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
export function SearchField({
  value,
  onChange,
  placeholder,
}: {
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
}) {
  return (
    <div className="admin-search">
      <Search size={16} aria-hidden="true" />
      <Input
        aria-label={placeholder}
        placeholder={placeholder}
        value={value}
        onChange={(event) => onChange(event.target.value)}
      />
      {value && (
        <button
          type="button"
          aria-label="Limpiar búsqueda"
          onClick={() => onChange("")}
        >
          <X size={14} />
        </button>
      )}
    </div>
  );
}
export function AdminDialog({
  open,
  onOpenChange,
  title,
  description,
  children,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  children: ReactNode;
}) {
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Backdrop className="admin-dialog-backdrop" />
        <Dialog.Popup className="admin-theme admin-dialog">
          <header>
            <div>
              <Dialog.Title>{title}</Dialog.Title>
              {description && (
                <Dialog.Description>{description}</Dialog.Description>
              )}
            </div>
            <Dialog.Close
              render={
                <Button
                  variant="ghost"
                  size="icon"
                  aria-label="Cerrar diálogo"
                />
              }
            >
              <X size={18} />
            </Dialog.Close>
          </header>
          <div className="admin-dialog-body">{children}</div>
        </Dialog.Popup>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
export function EmptyState({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children?: ReactNode;
}) {
  return (
    <div className="admin-empty">
      <Inbox size={27} strokeWidth={1.4} aria-hidden="true" />
      <h3>{title}</h3>
      <p>{description}</p>
      {children}
    </div>
  );
}
export function Pagination({
  page,
  total,
  pageSize,
  onChange,
}: {
  page: number;
  total: number;
  pageSize: number;
  onChange: (page: number) => void;
}) {
  const pages = Math.max(1, Math.ceil(total / pageSize));
  return (
    <div className="admin-pagination">
      <span>
        {total
          ? `${(page - 1) * pageSize + 1}–${Math.min(page * pageSize, total)} de ${total}`
          : "0 resultados"}
      </span>
      <div>
        <Button
          variant="outline"
          size="icon-sm"
          disabled={page <= 1}
          aria-label="Página anterior"
          onClick={() => onChange(page - 1)}
        >
          <ChevronLeft />
        </Button>
        <span>
          Página {page} de {pages}
        </span>
        <Button
          variant="outline"
          size="icon-sm"
          disabled={page >= pages}
          aria-label="Página siguiente"
          onClick={() => onChange(page + 1)}
        >
          <ChevronRight />
        </Button>
      </div>
    </div>
  );
}
export function StatusBadge({
  label,
  tone = "neutral",
}: {
  label: string;
  tone?: "green" | "amber" | "neutral" | "red";
}) {
  return (
    <span className={`admin-status admin-status-${tone}`}>
      <i aria-hidden="true" />
      {label}
    </span>
  );
}

export function ActionLink({
  href,
  children,
  variant = "default",
  size = "default",
  ...props
}: {
  href: string;
  children: ReactNode;
  variant?: "default" | "outline" | "ghost";
  size?: "default" | "icon";
  "aria-label"?: string;
}) {
  return (
    <Link
      href={href}
      data-slot="button"
      className={buttonVariants({ variant, size })}
      {...props}
    >
      {children}
    </Link>
  );
}
