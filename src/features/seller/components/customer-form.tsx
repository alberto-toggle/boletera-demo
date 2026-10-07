"use client";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BuyerAccountSearch } from "./buyer-account-search";
import type { BuyerAccountOption, Customer } from "../model";
export function CustomerForm({
  accounts,
  customer,
  count,
  onChange,
  onContinue,
}: {
  accounts: BuyerAccountOption[];
  customer: Customer;
  count: number;
  onChange: (value: Customer) => void;
  onContinue: () => void;
}) {
  const change = <K extends keyof Customer>(key: K, value: Customer[K]) =>
    onChange({ ...customer, [key]: value });
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onContinue();
      }}
    >
      <h2>¿Para quién son los boletos?</h2>
      <BuyerAccountSearch
        accounts={accounts}
        customer={customer}
        onChange={onChange}
      />
      <label>
        Nombre del comprador
        <input
          required
          maxLength={120}
          autoComplete="name"
          readOnly={!!customer.accountEmail}
          value={customer.name}
          onChange={(e) => change("name", e.target.value)}
        />
      </label>
      <fieldset>
        <legend>Entrega de boletos</legend>
        <div className="seller-options">
          {(
            [
              ["print", "Impresos"],
              ["email", "Por correo"],
              ["both", "Ambos"],
            ] as const
          ).map(([value, label]) => (
            <label key={value}>
              <input
                type="radio"
                name="delivery"
                checked={customer.delivery === value}
                onChange={() => change("delivery", value)}
              />
              {label}
            </label>
          ))}
        </div>
      </fieldset>
      <label>
        {customer.accountEmail
          ? "Correo de la cuenta"
          : `Correo electrónico ${customer.delivery === "print" ? "(opcional)" : ""}`}
        <input
          type="email"
          readOnly={!!customer.accountEmail}
          required={customer.delivery !== "print"}
          autoComplete="email"
          maxLength={180}
          value={customer.email}
          onChange={(e) => change("email", e.target.value)}
        />
      </label>
      <small>
        {customer.accountEmail
          ? "Los boletos se guardarán en la cuenta seleccionada. También puedes entregarlos impresos o por correo."
          : "No necesita cuenta. Confirma el correo con el comprador antes de continuar."}
      </small>
      <fieldset>
        <legend>El comprador es</legend>
        <div className="seller-options">
          <label>
            <input
              name="audience"
              type="radio"
              checked={customer.audience === "public"}
              onChange={() => change("audience", "public")}
            />
            Público general
          </label>
          <label>
            <input
              name="audience"
              type="radio"
              checked={customer.audience === "military"}
              onChange={() => change("audience", "military")}
            />
            Militar
          </label>
        </div>
      </fieldset>
      {customer.audience === "military" && (
        <label>
          Matrícula del comprador
          <input
            required
            maxLength={40}
            value={customer.registration}
            onChange={(e) => change("registration", e.target.value)}
          />
        </label>
      )}
      <div className="seller-attendees">
        <label>
          Boletos para militares
          <input
            type="number"
            min={0}
            max={count}
            step={1}
            required
            value={customer.militaryCount}
            onChange={(e) => change("militaryCount", Number(e.target.value))}
          />
        </label>
        <div>
          <strong>{count - customer.militaryCount}</strong>
          <span>para público general</span>
        </div>
      </div>
      <small>
        Incluye al comprador solo si asistirá. No pedimos matrículas de
        acompañantes.
      </small>
      <Button type="submit" className="seller-primary">
        Continuar a cobro <ArrowRight size={17} />
      </Button>
    </form>
  );
}
