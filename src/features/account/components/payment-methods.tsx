"use client";
import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Plus, Check, Trash2, CreditCard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAccount, updateAccount } from "../store";
import {
  addPaymentExample,
  changePaymentMethod,
  paymentExamples,
  savedPaymentMethods,
} from "../payment-methods";
import { AccountDialog } from "./account-dialog";
import { PaymentFolder } from "./payment-folder";

type DialogState = { kind: "add" } | { kind: "remove"; id: string } | null;
export function PaymentMethods({ base }: { base: string }) {
  const { state, user } = useAccount();
  const [dialog, setDialog] = useState<DialogState>(null);
  const [notice, setNotice] = useState("");
  const [error, setError] = useState("");
  const cards = savedPaymentMethods(state).filter(
    (c) => c.ownerEmail === user?.email,
  );
  const removing =
    dialog?.kind === "remove"
      ? cards.find((c) => c.id === dialog.id)
      : undefined;
  function run(action: Parameters<typeof updateAccount>[0], message: string) {
    try {
      updateAccount(action);
      setNotice(message);
      setError("");
      setDialog(null);
    } catch (e) {
      setError(
        e instanceof Error ? e.message : "No se pudo guardar el cambio.",
      );
    }
  }
  if (!user) return null;
  return (
    <>
      <Link className="account-back" href={base}>
        <ArrowLeft size={17} />
        Mis boletos
      </Link>
      <div className="account-heading payment-heading">
        <div>
          <p className="eyebrow">TU CUENTA</p>
          <h1>Mis métodos de pago</h1>
          <p>Tus tarjetas, listas para tu próxima experiencia.</p>
        </div>
        <Button
          className="demo-button"
          onClick={() => {
            setError("");
            setDialog({ kind: "add" });
          }}
        >
          <Plus size={18} />
          Agregar tarjeta
        </Button>
      </div>
      <p className="payment-demo-note">
        Demostración con tarjetas de ejemplo · Sin cobros reales
      </p>
      <p role="status" className="payment-notice">
        {notice}
      </p>
      {!dialog && error && <p role="alert">{error}</p>}
      {cards.length ? (
        <div className="payment-methods-grid">
          {cards.map((card) => (
            <article
              className="payment-method"
              key={card.id}
              aria-label={`${card.brand} terminada en ${card.last4}`}
            >
              <div className="payment-badge-row">
                {card.isDefault && (
                  <span className="payment-default">
                    <Check size={14} />
                    Predeterminada
                  </span>
                )}
              </div>
              <PaymentFolder card={card} name={user.name} />
              <div className="payment-method-actions">
                {card.isDefault ? (
                  <span>Tu tarjeta principal</span>
                ) : (
                  <Button
                    variant="ghost"
                    onClick={() =>
                      run(
                        (s) => changePaymentMethod(s, card.id, "default"),
                        `${card.brand} terminada en ${card.last4} es tu tarjeta predeterminada.`,
                      )
                    }
                  >
                    Usar como predeterminada
                  </Button>
                )}
                <Button
                  variant="ghost"
                  size="icon"
                  aria-label={`Eliminar ${card.brand} terminada en ${card.last4}`}
                  onClick={() => {
                    setError("");
                    setDialog({ kind: "remove", id: card.id });
                  }}
                >
                  <Trash2 size={18} />
                </Button>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <div className="account-empty">
          <CreditCard size={36} aria-hidden="true" />
          <h2>Aún no tienes tarjetas guardadas</h2>
          <p>Agrega una tarjeta de ejemplo para explorar tu cartera.</p>
        </div>
      )}
      {dialog?.kind === "add" && (
        <AccountDialog title="Agregar tarjeta" onClose={() => setDialog(null)}>
          <div className="payment-dialog-content">
            <p>Elige una tarjeta de ejemplo para probar tu cartera.</p>
            {paymentExamples.map((card, index) => {
              const exists = cards.some(
                (c) => c.brand === card.brand && c.last4 === card.last4,
              );
              return (
                <Button
                  key={card.last4}
                  variant="outline"
                  className="payment-example"
                  disabled={exists}
                  onClick={() =>
                    run(
                      (s) =>
                        addPaymentExample(
                          s,
                          index,
                          `demo-card-${crypto.randomUUID()}`,
                        ),
                      "Tarjeta de ejemplo agregada.",
                    )
                  }
                >
                  <CreditCard size={22} />
                  <span>
                    {card.brand} ···· {card.last4}
                    <small>Vence {card.expiry}</small>
                  </span>
                  {exists ? <span>Agregada</span> : <Plus size={18} />}
                </Button>
              );
            })}
            {error && <p role="alert">{error}</p>}
          </div>
        </AccountDialog>
      )}
      {dialog?.kind === "remove" && (
        <AccountDialog title="Eliminar tarjeta" onClose={() => setDialog(null)}>
          <div className="payment-dialog-content">
            <p>
              ¿Eliminar {removing?.brand} terminada en {removing?.last4} de tu
              cartera?
            </p>
            {removing?.isDefault && cards.length > 1 && (
              <p>Otra de tus tarjetas quedará como predeterminada.</p>
            )}
            {error && <p role="alert">{error}</p>}
            <div className="payment-dialog-actions">
              <Button variant="outline" onClick={() => setDialog(null)}>
                Conservar tarjeta
              </Button>
              <Button
                className="demo-button"
                onClick={() =>
                  run(
                    (s) => changePaymentMethod(s, dialog.id, "remove"),
                    "Tarjeta eliminada de tu cartera.",
                  )
                }
              >
                Eliminar tarjeta
              </Button>
            </div>
          </div>
        </AccountDialog>
      )}
    </>
  );
}
