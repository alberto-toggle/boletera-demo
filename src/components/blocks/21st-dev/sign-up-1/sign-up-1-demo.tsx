"use client";

import { useState } from "react";
import SignUp from "./sign-up-1";

export default function SignUpDemo() {
  const [message, setMessage] = useState(
    "Usa datos ficticios. Todas las acciones son simuladas.",
  );
  return (
    <div>
      <p role="status" className="mb-4 min-h-10 text-sm text-muted-foreground">
        {message}
      </p>
      <div
        lang="en"
        className="@container w-full rounded-2xl border bg-background"
      >
        <div className="flex min-h-[720px] items-center justify-center p-3 sm:p-6">
          <SignUp
            onSignUp={() =>
              setMessage(
                "Registro simulado. No se creó una cuenta ni se enviaron tus datos.",
              )
            }
            onSocialSignUp={(provider) =>
              setMessage(
                `Registro con ${provider} simulado. No se conectó ninguna cuenta.`,
              )
            }
            onSignIn={() =>
              setMessage("Acceso de demostración. No se inició ninguna sesión.")
            }
            onHome={() =>
              setMessage(
                "Este es el ejemplo original del registro; estás en el playground.",
              )
            }
          />
        </div>
      </div>
    </div>
  );
}
