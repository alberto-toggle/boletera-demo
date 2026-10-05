"use client";

import { useState } from "react";
import { SignIn1 } from "./modern-stunning-sign-in";

export default function ModernStunningSignInDemo() {
  const [message, setMessage] = useState(
    "Usa datos ficticios. Todas las acciones de esta vista son simuladas.",
  );
  return (
    <div>
      <p role="status" className="mb-4 min-h-10 text-sm text-muted-foreground">
        {message}
      </p>
      <div lang="en">
        <SignIn1
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
          onSignUp={() =>
            setMessage("Registro de demostración. No se creó ninguna cuenta.")
          }
        />
      </div>
    </div>
  );
}
