"use client";
import { useId, useState, type FormEvent } from "react";
import { ArrowRight, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FancyButton } from "@/features/booking/components/auth/fancy-button";
import { GoogleIcon } from "@/features/booking/components/auth/google-icon";
import { demoAccount } from "@/features/booking/fixtures";
import { companion } from "../fixtures";
import { normalizeEmail } from "../model";
import { signIn, useAccount } from "../store";
export function AccountAccess() {
  const { state } = useAccount();
  const id = useId();
  const [mode, setMode] = useState<"login" | "register">("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [error, setError] = useState("");
  function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    if (mode === "register" && name.trim().length < 3) {
      setError("Escribe tu nombre completo.");
      return;
    }
    const existing = state.users.find((u) => u.email === normalizeEmail(email));
    if (mode === "login" && !existing) {
      setError(
        "No encontramos esta cuenta. Revisa tu correo o crea una cuenta.",
      );
      return;
    }
    if (mode === "register" && existing) {
      setError("Ya existe esta cuenta. Selecciona Iniciar sesión.");
      return;
    }
    signIn(
      existing ?? {
        ...demoAccount,
        name: name.trim(),
        email: normalizeEmail(email),
        verifiedContact: normalizeEmail(email),
        phone: "",
      },
    );
  }
  return (
    <section className="account-access">
      <div className="account-access-intro">
        <p className="eyebrow">TUS MOMENTOS, A LA MANO</p>
        <h1>
          Nos vemos
          <br />
          <em>en tu próximo evento.</em>
        </h1>
        <p>
          Entra para consultar tus boletos, compartirlos con quien te acompaña y
          recordar tus encuentros anteriores.
        </p>
      </div>
      <form className="account-auth" onSubmit={submit}>
        <h2>Tu cuenta</h2>
        <div className="account-auth-options">
          {(
            [
              ["login", "Iniciar sesión"],
              ["register", "Crear cuenta"],
            ] as const
          ).map(([value, label]) => (
            <Button
              key={value}
              type="button"
              variant="outline"
              aria-pressed={mode === value}
              onClick={() => {
                setMode(value);
                setError("");
              }}
            >
              {label}
            </Button>
          ))}
        </div>
        {mode === "register" && (
          <div>
            <Label htmlFor={`${id}-name`}>Nombre completo</Label>
            <Input
              id={`${id}-name`}
              autoComplete="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              minLength={3}
              maxLength={100}
            />
          </div>
        )}
        <div>
          <Label htmlFor={`${id}-email`}>Correo electrónico</Label>
          <Input
            id={`${id}-email`}
            type="email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            maxLength={120}
          />
        </div>
        <div>
          <Label htmlFor={`${id}-password`}>Contraseña</Label>
          <div className="auth-password">
            <Input
              id={`${id}-password`}
              type={show ? "text" : "password"}
              autoComplete={
                mode === "login" ? "current-password" : "new-password"
              }
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              maxLength={72}
            />
            <Button
              variant="ghost"
              type="button"
              aria-label={show ? "Ocultar contraseña" : "Mostrar contraseña"}
              onClick={() => setShow(!show)}
            >
              {show ? <EyeOff size={18} /> : <Eye size={18} />}
            </Button>
          </div>
        </div>
        {error && <p role="alert">{error}</p>}
        <FancyButton className="demo-button" type="submit">
          {mode === "login" ? "Entrar a mis boletos" : "Crear mi cuenta"}
          <ArrowRight size={18} />
        </FancyButton>
        <Button
          type="button"
          variant="outline"
          className="account-google"
          onClick={() => signIn(demoAccount)}
        >
          <GoogleIcon />
          Continuar con Google
        </Button>
        <p className="account-disclaimer">
          Acceso simulado. Usa datos de prueba; no se guardan contraseñas.
        </p>
        <p data-demo>Google abre la cuenta de Alex.</p>
        <div data-demo className="account-examples">
          <span>Prueba la experiencia</span>
          {[demoAccount, companion].map((u) => (
            <Button
              key={u.email}
              variant="outline"
              type="button"
              onClick={() => {
                setMode("login");
                setEmail(u.email);
                setPassword("Demo2027");
                setError("");
              }}
            >
              {u.name.split(" ")[0]}
            </Button>
          ))}
        </div>
      </form>
    </section>
  );
}
