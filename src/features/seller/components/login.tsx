"use client";
import { useState } from "react";
import { Asterisk, ArrowRight, Ticket } from "lucide-react";
import { Button } from "@/components/ui/button";
export function SellerLogin({
  email,
  password,
  onLogin,
}: {
  email: string;
  password: string;
  onLogin: () => void;
}) {
  const [user, setUser] = useState("");
  const [pass, setPass] = useState("");
  const [error, setError] = useState("");
  return (
    <main className="seller-app seller-login">
      <section className="seller-login-story">
        <div className="seller-brand">
          <Asterisk />
          boletera.
        </div>
        <div>
          <Ticket size={40} />
          <p className="seller-eyebrow">OPERACIÓN · TAQUILLA</p>
          <h1>
            Cada encuentro
            <br />
            empieza contigo.
          </h1>
          <p>
            Todo listo para recibir, vender y acompañar
            <br />a quienes vivirán el próximo evento.
          </p>
        </div>
        <small>Una experiencia de demostración.</small>
      </section>
      <section className="seller-login-form">
        <p className="seller-eyebrow">BIENVENIDO DE NUEVO</p>
        <h2>Acceso al equipo</h2>
        <p>Inicia sesión para abrir tu punto de venta.</p>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (user.trim().toLowerCase() === email && pass === password)
              onLogin();
            else
              setError(
                "Usa las credenciales de ejemplo para entrar a esta demo.",
              );
          }}
        >
          <label>
            Correo electrónico
            <input
              type="email"
              required
              autoComplete="username"
              value={user}
              onChange={(e) => setUser(e.target.value)}
            />
          </label>
          <label>
            Contraseña
            <input
              type="password"
              required
              autoComplete="current-password"
              value={pass}
              onChange={(e) => setPass(e.target.value)}
            />
          </label>
          {error && (
            <p role="alert" className="seller-error">
              {error}
            </p>
          )}
          <Button type="submit" className="seller-primary">
            Iniciar sesión <ArrowRight size={17} />
          </Button>
          <button
            type="button"
            className="seller-text-button"
            onClick={() => {
              setUser(email);
              setPass(password);
              setError("");
            }}
          >
            Usar datos de ejemplo
          </button>
        </form>
        <small>
          Acceso simulado para vendedor. No utilices credenciales reales.
        </small>
      </section>
    </main>
  );
}
