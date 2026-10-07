"use client";
import { useState } from "react";
import { Search, UserCheck } from "lucide-react";
import type { BuyerAccountOption, Customer } from "../model";
const normalizeSearch = (value: string) =>
  value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLocaleLowerCase();

export function BuyerAccountSearch({
  accounts,
  customer,
  onChange,
}: {
  accounts: BuyerAccountOption[];
  customer: Customer;
  onChange: (customer: Customer) => void;
}) {
  const [mode, setMode] = useState<"guest" | "account">(
    customer.accountEmail || customer.accountRequested ? "account" : "guest",
  );
  const [query, setQuery] = useState("");
  const matches =
    query.trim().length >= 2
      ? accounts.filter((a) =>
          normalizeSearch(`${a.name} ${a.email}`).includes(
            normalizeSearch(query.trim()),
          ),
        )
      : [];
  return (
    <fieldset className="seller-account-search">
      <legend>Tipo de compra</legend>
      <div className="seller-options">
        <label>
          <input
            type="radio"
            name="buyer-mode"
            checked={mode === "guest"}
            onChange={() => {
              setMode("guest");
              onChange({
                ...customer,
                accountEmail: undefined,
                accountRequested: false,
                verifiedEmail: undefined,
              });
            }}
          />
          Como invitado
        </label>
        <label>
          <input
            type="radio"
            name="buyer-mode"
            checked={mode === "account"}
            onChange={() => {
              setMode("account");
              onChange({
                ...customer,
                accountRequested: true,
                noEmail: false,
                verifiedEmail: undefined,
              });
            }}
          />
          Comprador con cuenta
        </label>
      </div>
      {mode === "account" && (
        <div className="seller-account-finder">
          {customer.accountEmail ? (
            <div className="seller-notice">
              <UserCheck size={22} />
              <div>
                <strong>{customer.name}</strong>
                <p>{customer.accountEmail}</p>
                <small>
                  Los boletos quedarán en esta cuenta al confirmar la venta.
                </small>
                <button
                  type="button"
                  className="seller-text-button"
                  onClick={() => {
                    onChange({
                      ...customer,
                      accountEmail: undefined,
                      verifiedEmail: undefined,
                      name: "",
                      email: "",
                    });
                    setQuery("");
                  }}
                >
                  Cambiar cuenta
                </button>
              </div>
            </div>
          ) : (
            <>
              <label>
                <span>
                  <Search size={16} /> Buscar comprador
                </span>
                <input
                  type="search"
                  placeholder="Nombre o correo electrónico"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                />
              </label>
              <p data-demo className="seller-muted">
                Cuentas de ejemplo: Alex Hernández y Sofía Martínez.
              </p>
              <div
                className="seller-account-results"
                aria-label="Resultados de cuentas"
              >
                {matches.map((account) => (
                  <button
                    type="button"
                    key={account.email}
                    onClick={() =>
                      onChange({
                        ...customer,
                        accountEmail: account.email,
                        accountRequested: true,
                        verifiedEmail: undefined,
                        noEmail: false,
                        name: account.name,
                        email: account.email,
                        audience: account.audience,
                        registration: account.registration,
                      })
                    }
                  >
                    <span>
                      <strong>{account.name}</strong>
                      <small>{account.email}</small>
                    </span>
                    <span>Seleccionar</span>
                  </button>
                ))}
              </div>
              {query.trim().length >= 2 && !matches.length && (
                <p role="status">
                  No encontramos esa cuenta. Puedes continuar como invitado.
                </p>
              )}
            </>
          )}
        </div>
      )}
    </fieldset>
  );
}
