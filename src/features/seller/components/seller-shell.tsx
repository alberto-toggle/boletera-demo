"use client";
import Link from "next/link";
import { ArrowUpRight, Asterisk, LogOut } from "lucide-react";
import type { ReactNode } from "react";
export function SellerShell({
  children,
  name,
  location,
  active,
  onLogout,
}: {
  children: ReactNode;
  name: string;
  location: string;
  active: "sell" | "sales";
  onLogout: () => void;
}) {
  return (
    <div className="seller-app">
      <header className="seller-header">
        <Link href="/operacion/vendedor" className="seller-brand">
          <Asterisk size={30} />
          boletera<span>.</span>
          <small>TAQUILLA</small>
        </Link>
        <nav aria-label="Navegación de vendedor">
          <Link
            aria-current={active === "sell" ? "page" : undefined}
            href="/operacion/vendedor"
          >
            Vender
          </Link>
          <Link
            aria-current={active === "sales" ? "page" : undefined}
            href="/operacion/vendedor/ventas"
          >
            Mis operaciones
          </Link>
        </nav>
        <div className="seller-user">
          <span>
            <strong>{name}</strong>
            <small>{location}</small>
          </span>
          <button aria-label="Cerrar sesión" onClick={onLogout}>
            <LogOut size={19} />
          </button>
        </div>
      </header>
      <div className="seller-demo-strip">
        <span>
          <i /> Punto de venta disponible
        </span>
        <span>
          Demostración · Sin cobros reales <ArrowUpRight size={12} />
        </span>
      </div>
      {children}
    </div>
  );
}
