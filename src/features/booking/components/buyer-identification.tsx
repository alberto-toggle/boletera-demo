"use client";

import { useId, useRef, useEffect, useState, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Eye,
  EyeOff,
  Ticket,
  ArrowRight,
  ArrowLeft,
  ShieldCheck,
} from "lucide-react";
import { FancyButton } from "./auth/fancy-button";
import { GoogleIcon } from "./auth/google-icon";
import { demoAccount } from "../fixtures";
import { validateContact, type Buyer, type DemoOrder } from "../model";

export function BuyerIdentification({
  initialBuyer,
  initialMode,
  onComplete,
}: {
  initialBuyer: Buyer;
  initialMode: DemoOrder["mode"];
  onComplete: (buyer: Buyer, mode: DemoOrder["mode"]) => void;
}) {
  const id = useId();
  const [buyer, setBuyer] = useState(initialBuyer);
  const [mode, setMode] = useState(initialMode);
  const [showPassword, setShowPassword] = useState(false);
  const [google, setGoogle] = useState(false);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const firstRender = useRef(true);
  const [password, setPassword] = useState("");
  const [verification, setVerification] = useState<{
    contact: string;
    channel: Buyer["contactChannel"];
  } | null>(null);
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    titleRef.current?.focus();
  }, [google, verification]);
  function changeMode(next: DemoOrder["mode"]) {
    setMode(next);
    setError("");
    setNotice("");
    setPassword("");
    setShowPassword(false);
  }
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    if (verification) {
      if (code !== "123456") {
        setError("El código no coincide. En esta demo usa 123456.");
        return;
      }
      onComplete({ ...buyer, verifiedContact: verification.contact }, mode);
      return;
    }
    const channel = mode === "account" ? "email" : buyer.contactChannel;
    if (
      !validateContact(channel, buyer[channel]) ||
      (mode !== "account" && buyer.name.trim().length < 3)
    ) {
      setError("Revisa tu nombre y el medio de contacto.");
      return;
    }
    if (mode !== "guest" && password.length < 6) {
      setError("Usa una contraseña de prueba de al menos 6 caracteres.");
      return;
    }
    if (mode === "account") {
      onComplete(
        {
          ...buyer,
          name: demoAccount.name,
          contactChannel: "email",
          verifiedContact: buyer.email.trim(),
        },
        mode,
      );
      return;
    }
    setVerification({ contact: buyer[channel].trim(), channel });
    setCode("");
  }
  return (
    <form
      onSubmit={submit}
      className="identity-form auth-card"
      aria-label="Identificación del comprador"
    >
      <div className="auth-brand-mark" aria-hidden="true">
        <Ticket size={25} />
      </div>
      {!google && !verification && (
        <div
          className="auth-mode-tabs"
          role="tablist"
          aria-label="Cómo quieres comprar"
        >
          {(
            [
              ["guest", "Comprar como invitado"],
              ["account", "Iniciar sesión"],
              ["register", "Crear cuenta"],
            ] as const
          ).map(([value, label], index, options) => (
            <button
              key={value}
              id={`${id}-tab-${value}`}
              type="button"
              role="tab"
              aria-selected={mode === value}
              aria-controls={`${id}-panel`}
              tabIndex={mode === value ? 0 : -1}
              onClick={() => changeMode(value)}
              onKeyDown={(event) => {
                const next =
                  event.key === "ArrowRight"
                    ? (index + 1) % options.length
                    : event.key === "ArrowLeft"
                      ? (index + options.length - 1) % options.length
                      : event.key === "Home"
                        ? 0
                        : event.key === "End"
                          ? options.length - 1
                          : null;
                if (next === null) return;
                event.preventDefault();
                changeMode(options[next][0]);
                document
                  .getElementById(`${id}-tab-${options[next][0]}`)
                  ?.focus();
              }}
            >
              {label}
            </button>
          ))}
        </div>
      )}
      <div
        id={`${id}-panel`}
        role={!google && !verification ? "tabpanel" : undefined}
        aria-labelledby={
          !google && !verification ? `${id}-tab-${mode}` : undefined
        }
      >
        <header className="auth-heading">
          <h3 ref={titleRef} tabIndex={-1}>
            {google
              ? "Continúa con Google"
              : verification
                ? "Verifica tu contacto"
                : mode === "register"
                  ? "Crea tu cuenta"
                  : mode === "account"
                    ? "Qué gusto verte de nuevo"
                    : "Compra sin crear una cuenta"}
          </h3>
          <p>
            {google
              ? "Elige la cuenta de ejemplo para esta compra."
              : verification
                ? "Un paso más para recibir tus boletos."
                : mode === "register"
                  ? "Tu próxima experiencia comienza aquí."
                  : mode === "account"
                    ? "Inicia sesión para continuar tu compra."
                    : "Solo necesitamos tu nombre y un medio de contacto."}
          </p>
        </header>
        {google ? (
          <div className="auth-google-choice">
            <GoogleIcon className="auth-google-icon" aria-hidden="true" />
            <p className="auth-demo-note">
              Acceso de demostración · No se conecta con Google.
            </p>
            <Button
              type="button"
              variant="outline"
              className="auth-account-choice"
              onClick={() =>
                onComplete(
                  {
                    ...buyer,
                    name: demoAccount.name,
                    email: demoAccount.email,
                    contactChannel: "email",
                    verifiedContact: demoAccount.email,
                  },
                  "account",
                )
              }
            >
              <span className="auth-avatar" aria-hidden="true">
                AH
              </span>
              <span>
                <strong>{demoAccount.name}</strong>
                <small>{demoAccount.email}</small>
              </span>
              <ArrowRight size={18} />
            </Button>
            <Button
              type="button"
              variant="link"
              onClick={() => setGoogle(false)}
            >
              <ArrowLeft size={16} /> Volver a las opciones
            </Button>
          </div>
        ) : (
          <>
            {!verification ? (
              <>
                {mode !== "guest" && (
                  <>
                    <Button
                      type="button"
                      variant="outline"
                      className="auth-google-button"
                      onClick={() => {
                        setGoogle(true);
                        setError("");
                      }}
                    >
                      <GoogleIcon
                        className="auth-google-icon"
                        aria-hidden="true"
                      />{" "}
                      Continuar con Google
                    </Button>
                    <p className="auth-demo-note">
                      Acceso simulado · Usa datos de prueba
                    </p>
                    <div className="auth-divider">
                      <span>o con tus datos</span>
                    </div>
                  </>
                )}
                <div className="buyer-fields">
                  {mode !== "account" && (
                    <div>
                      <Label htmlFor={`${id}-name`}>Nombre completo</Label>
                      <Input
                        id={`${id}-name`}
                        autoComplete="name"
                        required
                        maxLength={120}
                        value={buyer.name}
                        onChange={(e) =>
                          setBuyer({ ...buyer, name: e.target.value })
                        }
                      />
                    </div>
                  )}
                  {mode !== "account" && (
                    <fieldset className="payment-scenario">
                      <legend>Verifica tu contacto con</legend>
                      {(
                        [
                          ["email", "Correo electrónico"],
                          ["phone", "Teléfono"],
                        ] as const
                      ).map(([value, label]) => (
                        <label key={value}>
                          <input
                            type="radio"
                            name={`${id}-channel`}
                            checked={buyer.contactChannel === value}
                            onChange={() =>
                              setBuyer({
                                ...buyer,
                                contactChannel: value,
                                verifiedContact: "",
                              })
                            }
                          />
                          {label}
                        </label>
                      ))}
                    </fieldset>
                  )}
                  {(() => {
                    const channel =
                      mode === "account" ? "email" : buyer.contactChannel;
                    return (
                      <div>
                        <Label htmlFor={`${id}-contact`}>
                          {channel === "email"
                            ? "Correo electrónico"
                            : "Teléfono"}
                        </Label>
                        <Input
                          id={`${id}-contact`}
                          type={channel === "email" ? "email" : "tel"}
                          autoComplete={channel === "email" ? "email" : "tel"}
                          required
                          maxLength={channel === "email" ? 120 : 18}
                          value={buyer[channel]}
                          onChange={(e) =>
                            setBuyer({
                              ...buyer,
                              [channel]: e.target.value,
                              verifiedContact: "",
                            })
                          }
                        />
                      </div>
                    );
                  })()}
                  {mode !== "guest" && (
                    <div>
                      <Label htmlFor={`${id}-password`}>
                        Contraseña de prueba
                      </Label>
                      <div className="auth-password">
                        <Input
                          id={`${id}-password`}
                          type={showPassword ? "text" : "password"}
                          autoComplete={
                            mode === "register"
                              ? "new-password"
                              : "current-password"
                          }
                          required
                          minLength={6}
                          maxLength={72}
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          aria-label={
                            showPassword
                              ? "Ocultar contraseña"
                              : "Mostrar contraseña"
                          }
                          aria-pressed={showPassword}
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? (
                            <EyeOff size={18} />
                          ) : (
                            <Eye size={18} />
                          )}
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
                <Button
                  variant="link"
                  type="button"
                  onClick={() => {
                    setBuyer({
                      ...demoAccount,
                      contactChannel: buyer.contactChannel,
                      verifiedContact: "",
                    });
                    setPassword("Demo2027");
                  }}
                >
                  Usar datos de ejemplo
                </Button>
                <FancyButton
                  type="submit"
                  className="auth-submit demo-button booking-pay"
                >
                  {mode === "account"
                    ? "Entrar y continuar"
                    : mode === "register"
                      ? "Crear cuenta y continuar"
                      : "Continuar y verificar"}{" "}
                  <ArrowRight size={17} />
                </FancyButton>
              </>
            ) : (
              <div className="verification-step">
                <p className="eyebrow">
                  VERIFICA TU{" "}
                  {verification.channel === "email" ? "CORREO" : "TELÉFONO"}
                </p>
                <ShieldCheck size={24} aria-hidden="true" />
                <p>{verification.contact}</p>
                <Label htmlFor={`${id}-code`}>Código de 6 dígitos</Label>
                <Input
                  id={`${id}-code`}
                  className="verification-code"
                  inputMode="numeric"
                  autoComplete="one-time-code"
                  pattern="[0-9]{6}"
                  maxLength={6}
                  required
                  value={code}
                  onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
                />
                <small>
                  Simulación: no enviamos mensajes. Código de prueba:{" "}
                  <strong>123456</strong>.
                </small>
                <FancyButton
                  type="submit"
                  className="auth-submit demo-button booking-pay"
                >
                  {mode === "register"
                    ? "Verificar y crear cuenta"
                    : "Verificar y continuar"}
                </FancyButton>
                <div className="buyer-options">
                  <Button
                    type="button"
                    variant="link"
                    onClick={() => {
                      setVerification(null);
                      setCode("");
                      setNotice("");
                      setError("");
                    }}
                  >
                    Cambiar contacto
                  </Button>
                  <Button
                    type="button"
                    variant="link"
                    onClick={() => {
                      setCode("");
                      setNotice("Código de prueba renovado: 123456.");
                    }}
                  >
                    Reenviar código
                  </Button>
                </div>
                {notice && <p role="status">{notice}</p>}
              </div>
            )}
          </>
        )}
        {error && (
          <p role="alert" className="booking-alert">
            {error}
          </p>
        )}
      </div>
    </form>
  );
}
