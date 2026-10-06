"use client";
import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { CreditCard, Ticket, UserRound, LogOut, ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAccount, signOut } from "../store";
import { AccountDialog } from "./account-dialog";
export function AccountMenu() {
  const { user } = useAccount();
  const path = usePathname();
  const base = `/${path.split("/")[1]}`;
  const [anchor, setAnchor] = useState<{ top: number; right: number } | null>(
    null,
  );
  return (
    <>
      <Button
        className="account-link"
        variant="ghost"
        aria-haspopup="dialog"
        aria-expanded={!!anchor}
        onClick={(e) => {
          const rect = e.currentTarget.getBoundingClientRect();
          setAnchor({
            top: rect.bottom + 8,
            right: Math.max(16, innerWidth - rect.right),
          });
        }}
      >
        <UserRound size={17} aria-hidden="true" />
        <span>Mi cuenta</span>
      </Button>
      {anchor && (
        <AccountDialog
          title="Mi cuenta"
          anchor={anchor}
          onClose={() => setAnchor(null)}
        >
          <div className="account-menu-content">
            {user ? (
              <>
                <p className="account-welcome">
                  Hola, {user.name.split(" ")[0]}
                  <small>{user.email}</small>
                </p>
                <Link href={`${base}/cuenta`} onClick={() => setAnchor(null)}>
                  <Ticket size={19} />
                  Mis boletos
                </Link>
                <Link
                  href={`${base}/cuenta/perfil`}
                  onClick={() => setAnchor(null)}
                >
                  <UserRound size={19} />
                  Mis datos
                </Link>
                <Link href={`${base}/cuenta/metodos-de-pago`} onClick={() => setAnchor(null)}>
                  <CreditCard size={19} />Mis métodos de pago
                </Link>
                <button
                  type="button"
                  onClick={() => {
                    signOut();
                    setAnchor(null);
                  }}
                >
                  <LogOut size={19} />
                  Cerrar sesión
                </button>
              </>
            ) : (
              <>
                <p>
                  Tus próximos encuentros y todos tus boletos, en un solo lugar.
                </p>
                <Link
                  className="demo-button"
                  href={`${base}/cuenta`}
                  onClick={() => setAnchor(null)}
                >
                  Entrar a mi cuenta <ArrowUpRight size={18} />
                </Link>
              </>
            )}
          </div>
        </AccountDialog>
      )}
    </>
  );
}
