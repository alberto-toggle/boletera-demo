"use client";
import {
  createContext,
  useContext,
  useSyncExternalStore,
  useState,
  type ReactNode,
} from "react";
import Link from "next/link";
import { Asterisk, ArrowRight, ShieldCheck, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import "./access.css";
export type InternalProfile = "administrator" | "observer" | "staff";
const profiles = {
  administrator: {
    name: "Andrea Morales",
    label: "Administración",
    email: "andrea@boletera.demo",
  },
  observer: {
    name: "Daniel Ríos",
    label: "Consulta administrativa",
    email: "daniel@boletera.demo",
  },
  staff: {
    name: "Mariana Torres",
    label: "Staff de acceso",
    email: "mariana@boletera.demo",
  },
};
const sessionFallback: Record<"admin" | "staff", InternalProfile | null> = {
  admin: null,
  staff: null,
};
function readSession(area: "admin" | "staff"): InternalProfile | null {
  let value: string | null = sessionFallback[area];
  try {
    value = sessionStorage.getItem(`boletera-${area}-session-v1`);
  } catch {
    /* Memory fallback. */
  }
  return area === "staff"
    ? value === "staff"
      ? value
      : null
    : value === "administrator" || value === "observer"
      ? value
      : null;
}
function subscribeSession(callback: () => void) {
  window.addEventListener("boletera-internal-session", callback);
  window.addEventListener("storage", callback);
  return () => {
    window.removeEventListener("boletera-internal-session", callback);
    window.removeEventListener("storage", callback);
  };
}
const Context = createContext<{
  profile: InternalProfile;
  canEdit: boolean;
  name: string;
  signOut: () => void;
} | null>(null);
export function useInternalAccess() {
  const value = useContext(Context);
  if (!value) throw new Error("Se requiere acceso interno");
  return value;
}
export function InternalGate({
  area,
  children,
}: {
  area: "admin" | "staff";
  children: ReactNode;
}) {
  const key = `boletera-${area}-session-v1`;
  const profile = useSyncExternalStore(
    subscribeSession,
    () => readSession(area),
    () => "loading" as const,
  );
  const setProfile = (value: InternalProfile | null) => {
    sessionFallback[area] = value;
    try {
      if (value) sessionStorage.setItem(key, value);
      else sessionStorage.removeItem(key);
    } catch {
      /* Memory-only session. */
    }
    window.dispatchEvent(new Event("boletera-internal-session"));
  };
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const signOut = () => {
    try {
      sessionStorage.removeItem(key);
    } catch {}
    setProfile(null);
    setPassword("");
  };
  if (profile === "loading")
    return (
      <div className="internal-loading" role="status">
        Preparando tu acceso…
      </div>
    );
  if (profile)
    return (
      <Context.Provider
        value={{
          profile,
          name: profiles[profile].name,
          canEdit: profile === "administrator",
          signOut,
        }}
      >
        {children}
      </Context.Provider>
    );
  const allowed: InternalProfile[] =
    area === "admin" ? ["administrator", "observer"] : ["staff"];
  return (
    <main className="internal-login">
      <section className="internal-intro">
        <Link href="/" className="internal-brand">
          <Asterisk /> boletera.
        </Link>
        <div>
          <span className="internal-kicker">
            {area === "admin"
              ? "CADA DETALLE, BAJO CONTROL"
              : "EL ENCUENTRO EMPIEZA CONTIGO"}
          </span>
          <h1>
            {area === "admin"
              ? "Tu operación, en un solo lugar."
              : "Una bienvenida sin complicaciones."}
          </h1>
          <p>
            {area === "admin"
              ? "Prepara tus eventos, consulta resultados y acompaña cada momento de la operación."
              : "Valida boletos, encuentra a tus asistentes y mantén el acceso en movimiento."}
          </p>
        </div>
        <small>Boletera · Espacio de trabajo</small>
      </section>
      <section className="internal-login-panel">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            const match = allowed.find(
              (id) => profiles[id].email === email.trim().toLowerCase(),
            );
            if (!match || password !== "Demo2026!") {
              setError("Revisa el correo y la contraseña de demostración.");
              return;
            }
            try {
              sessionStorage.setItem(key, match);
            } catch {}
            setProfile(match);
            setError("");
          }}
        >
          <ShieldCheck size={26} />
          <h2>
            {area === "admin" ? "Acceso administrativo" : "Acceso de staff"}
          </h2>
          <p>Entra con tu cuenta de trabajo.</p>
          <label>
            Correo electrónico
            <Input
              type="email"
              autoComplete="username"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </label>
          <label>
            Contraseña
            <Input
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </label>
          {error && <p role="alert">{error}</p>}
          <Button type="submit">
            Iniciar sesión <ArrowRight size={16} />
          </Button>
          <div data-demo className="internal-demo">
            <strong>Acceso simulado · Demo2026!</strong>
            {allowed.map((id) => (
              <button
                type="button"
                key={id}
                onClick={() => {
                  setEmail(profiles[id].email);
                  setPassword("Demo2026!");
                  setError("");
                }}
              >
                {profiles[id].label} · Autollenar
              </button>
            ))}
          </div>
          <Link href="/">Volver al inicio</Link>
        </form>
      </section>
    </main>
  );
}
export function InternalSignOut() {
  const { signOut } = useInternalAccess();
  return (
    <button type="button" onClick={signOut}>
      <LogOut size={17} /> <span>Cerrar sesión</span>
    </button>
  );
}
