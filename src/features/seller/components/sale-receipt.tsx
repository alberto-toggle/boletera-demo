"use client";
import { useState, type ReactNode } from "react";
import Link from "next/link";
import { CheckCircle2, Mail, Printer, ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PaymentBreakdown } from "./payment-breakdown";
import { money, total, type Sale, type SellerEvent } from "../model";
export function SaleReceipt({
  sale,
  tickets,
  information,
}: {
  sale: Sale;
  event: SellerEvent;
  tickets: ReactNode;
  information: ReactNode;
}) {
  const [message, setMessage] = useState("");
  return (
    <main className="seller-main seller-receipt">
      <div className="seller-heading">
        <div>
          <p className="seller-eyebrow">
            <CheckCircle2 size={17} /> VENTA CONFIRMADA · {sale.id}
          </p>
          <h1>Todo listo para el encuentro.</h1>
          <p>
            {sale.customer?.name} · {sale.seats.length} boletos ·{" "}
            {money(total(sale))}
          </p>
        </div>
        <Link href="/operacion/vendedor" className="seller-primary">
          Nueva venta <ArrowUpRight size={17} />
        </Link>
      </div>
      {information}
      <div className="seller-receipt-bar">
        <Link href="/operacion/vendedor/ventas">Ver mis operaciones</Link>
      </div>
      <PaymentBreakdown sale={sale} />
      {sale.customer && (
        <dl className="seller-buyer-summary">
          <div>
            <dt>Comprador</dt>
            <dd>
              {sale.customer.audience === "military"
                ? "Militar"
                : "Público general"}
              {sale.customer.audience === "military" &&
                ` · Matrícula ${sale.customer.registration}`}
            </dd>
          </div>
          <div>
            <dt>Asistentes</dt>
            <dd>
              {sale.customer.militaryCount} militares ·{" "}
              {sale.seats.length - sale.customer.militaryCount} público general
            </dd>
          </div>
          {sale.customer.email && (
            <div>
              <dt>Correo de contacto</dt>
              <dd>{sale.customer.email}</dd>
            </div>
          )}
        </dl>
      )}
      <div className="seller-actions">
        <Button className="seller-secondary" onClick={() => window.print()}>
          <Printer size={17} />
          Imprimir boletos
        </Button>

        {sale.customer?.delivery !== "print" && sale.customer?.email && (
          <Button
            data-demo
            className="seller-secondary"
            onClick={() =>
              setMessage(
                `Envío simulado a ${sale.customer?.email}. No se envió ningún correo real.`,
              )
            }
          >
            <Mail size={17} />
            Simular envío por correo
          </Button>
        )}
      </div>
      <p role="status" className="seller-muted">
        {message ||
          `Entrega elegida: ${sale.customer?.delivery === "both" ? "impresos y correo" : sale.customer?.delivery === "email" ? "correo electrónico" : "impresos"}. Cada boleto puede utilizarse de forma independiente.`}
      </p>
      {sale.customer?.accountEmail && (
        <p className="seller-notice" role="status">
          Boletos vinculados a {sale.customer.accountEmail}. El comprador puede
          verlos en Mis eventos al iniciar sesión en su cuenta.
        </p>
      )}
      {tickets}
    </main>
  );
}
