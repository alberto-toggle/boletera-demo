"use client";

import { useState } from "react";
import { SignInCard } from "./sign-in-card-2";

export default function SignInCardDemo() {
  const [message, setMessage] = useState(
    "Usa datos ficticios. Todas las acciones son simuladas.",
  );
  return (
    <div>
      <p role="status" className="mb-4 min-h-10 text-sm text-muted-foreground">
        {message}
      </p>
      <div lang="en" className="overflow-hidden rounded-2xl">
        <SignInCard
          onSignIn={() =>
            setMessage(
              "Inicio de sesión simulado. No se enviaron ni guardaron tus datos.",
            )
          }
          onGoogleSignIn={() =>
            setMessage(
              "Acceso con Google simulado. No se conectó ninguna cuenta.",
            )
          }
          onResetPassword={() =>
            setMessage("Recuperación simulada. No se envió ningún correo.")
          }
          onSignUp={() =>
            setMessage("Registro simulado. No se creó ninguna cuenta.")
          }
        />
      </div>
    </div>
  );
}
