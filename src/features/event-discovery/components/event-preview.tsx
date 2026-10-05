"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useId, useRef, type ReactNode } from "react";
import { ArrowUpRight, X } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import type { DiscoveryEvent } from "../model";

function Modal({
  label,
  className,
  children,
  title,
}: {
  label: ReactNode;
  className?: string;
  children: ReactNode;
  title: string;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  const titleId = useId();
  return (
    <>
      {className?.includes("stretched-trigger") ? (
        <>
          <span
            aria-hidden="true"
            className={buttonVariants({ variant: "ghost", className })}
          >
            {label}
          </span>
          <button
            type="button"
            className="card-hit-button"
            aria-haspopup="dialog"
            onClick={() => ref.current?.showModal()}
          >
            <span className="sr-only">{title}</span>
          </button>
        </>
      ) : (
        <Button
          className={className}
          variant="ghost"
          aria-haspopup="dialog"
          onClick={() => ref.current?.showModal()}
        >
          {label}
        </Button>
      )}
      <dialog
        ref={ref}
        className="event-modal"
        aria-labelledby={titleId}
        onClick={(event) => {
          if (event.target === event.currentTarget) {
            const rect = event.currentTarget.getBoundingClientRect();
            if (
              event.clientX < rect.left ||
              event.clientX > rect.right ||
              event.clientY < rect.top ||
              event.clientY > rect.bottom
            )
              ref.current?.close();
          }
        }}
      >
        <div className="modal-heading">
          <span className="eyebrow">Boletera · Vista previa</span>
          <Button
            variant="ghost"
            size="icon"
            aria-label="Cerrar vista previa"
            onClick={() => ref.current?.close()}
          >
            <X />
          </Button>
        </div>
        <h2 id={titleId}>{title}</h2>
        {children}
        <Button className="demo-button" onClick={() => ref.current?.close()}>
          Seguir explorando <ArrowUpRight aria-hidden="true" />
        </Button>
      </dialog>
    </>
  );
}

export function EventPreview({
  event,
  className = "demo-button",
  children,
}: {
  event: DiscoveryEvent;
  className?: string;
  children?: ReactNode;
}) {
  const pathname = usePathname();
  const parent = pathname.split("/")[1];
  const base = [
    "demo-institucional",
    "demo-gala",
    "demo-editorial",
    "demo-inmersiva",
  ].includes(parent)
    ? parent
    : "demo-institucional";
  const href = `/${base}/eventos/${event.id}`;
  const label = children ?? (
    <>
      Ver evento <ArrowUpRight aria-hidden="true" />
    </>
  );
  return className.includes("stretched-trigger") ? (
    <>
      <span
        aria-hidden="true"
        className={buttonVariants({ variant: "ghost", className })}
      >
        {label}
      </span>
      <Link
        href={href}
        className="card-hit-button"
        aria-label={`Ver ${event.title}`}
      />
    </>
  ) : (
    <Link href={href} className={className}>
      {label}
    </Link>
  );
}

export function AccountPreview() {
  return (
    <Modal
      className="account-link"
      label="Mi cuenta"
      title="Tu próxima experiencia, a tu manera."
    >
      <p className="modal-description">
        Podrás comprar como invitado o utilizar una cuenta para reunir tus
        boletos y consultar tus compras.
      </p>
      <p className="demo-notice">
        Al elegir un evento puedes probar el checkout como invitado o con la
        cuenta ficticia de Alex Hernández. No hay autenticación ni cobros
        reales.
      </p>
    </Modal>
  );
}
