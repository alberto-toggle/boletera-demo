"use client";

// GlassCheckoutCard from UI TripleD; card primitives from Kibo UI.
// Sources and adaptations: ./README.md.
import { useId, type ReactNode } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Calendar, CreditCard as CardIcon, Lock } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  CreditCard,
  CreditCardBack,
  CreditCardChip,
  CreditCardCvv,
  CreditCardExpiry,
  CreditCardFlipper,
  CreditCardFront,
  CreditCardMagStripe,
  CreditCardName,
  CreditCardNumber,
  CreditCardServiceProvider,
} from "./credit-card";

export type PaymentMethod = "card" | "paypal" | "apple";

export function PaymentDetails({
  name,
  method,
  onMethodChange,
  children,
}: {
  name: string;
  method: PaymentMethod;
  onMethodChange: (method: PaymentMethod) => void;
  children: ReactNode;
}) {
  const id = useId();
  const reduced = useReducedMotion();
  return (
    <motion.div
      initial={reduced ? false : { opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <Card className="payment-glass">
        <header className="payment-glass-heading">
          <CardIcon size={22} aria-hidden="true" />
          <div>
            <h3>Elige cómo pagar</h3>
            <p>Datos de ejemplo · No se realizará ningún cargo</p>
          </div>
        </header>
        <div
          className="payment-method-options"
          role="group"
          aria-label="Método de pago"
        >
          {(["card", "paypal", "apple"] as const).map((option) => (
            <button
              type="button"
              key={option}
              aria-pressed={method === option}
              onClick={() => onMethodChange(option)}
            >
              {option === "card" ? (
                <>
                  <CardIcon size={18} aria-hidden="true" /> Tarjeta
                </>
              ) : option === "paypal" ? (
                <span className="payment-paypal-wordmark">PayPal</span>
              ) : (
                <span>Apple Pay</span>
              )}
            </button>
          ))}
        </div>
        {method === "card" ? (
          <>
            <div className="payment-card-fields">
              <div>
                <Label htmlFor={`${id}-number`}>Número de tarjeta</Label>
                <div className="payment-icon-input">
                  <CardIcon aria-hidden="true" size={16} />
                  <Input
                    id={`${id}-number`}
                    value="4242 4242 4242 4242"
                    readOnly
                    autoComplete="off"
                  />
                </div>
              </div>
              <div className="payment-field-pair">
                <div>
                  <Label htmlFor={`${id}-expiry`}>Vencimiento</Label>
                  <div className="payment-icon-input">
                    <Calendar aria-hidden="true" size={16} />
                    <Input
                      id={`${id}-expiry`}
                      value="12/30"
                      readOnly
                      autoComplete="off"
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor={`${id}-cvc`}>CVC</Label>
                  <div className="payment-icon-input">
                    <Lock aria-hidden="true" size={16} />
                    <Input
                      id={`${id}-cvc`}
                      value="123"
                      readOnly
                      autoComplete="off"
                    />
                  </div>
                </div>
              </div>
              <div>
                <Label htmlFor={`${id}-holder`}>Titular de la tarjeta</Label>
                <Input
                  id={`${id}-holder`}
                  value={name}
                  readOnly
                  autoComplete="off"
                />
              </div>
            </div>
            <div className="payment-card-preview">
              <CreditCard>
                <CreditCardFlipper>
                  <CreditCardFront className="payment-card-face">
                    <p className="text-xs font-semibold tracking-widest">
                      BOLETERA · DEMO
                    </p>
                    <CreditCardChip className="top-[38%]" />
                    <CreditCardNumber className="absolute bottom-[27%] left-0 text-sm">
                      4242 4242 4242 4242
                    </CreditCardNumber>
                    <div className="absolute bottom-0 left-0 space-y-2 max-w-[65%]">
                      <CreditCardName className="text-xs truncate">
                        {name}
                      </CreditCardName>
                      <CreditCardExpiry className="text-xs">
                        12/30
                      </CreditCardExpiry>
                    </div>
                    <CreditCardServiceProvider type="Visa" />
                  </CreditCardFront>
                  <CreditCardBack className="payment-card-face">
                    <CreditCardMagStripe />
                    <div className="payment-card-signature">
                      <span>{name}</span>
                      <CreditCardCvv aria-label="Código de ejemplo: 123">
                        123
                      </CreditCardCvv>
                    </div>
                    <p className="absolute bottom-0 left-0 text-xs">
                      Tarjeta de prueba · Sin cargos
                    </p>
                  </CreditCardBack>
                </CreditCardFlipper>
              </CreditCard>
              <p className="payment-flip-hint">
                Pasa el cursor o toca la tarjeta para ver el reverso.
              </p>
            </div>
          </>
        ) : (
          <div className="payment-wallet-preview" role="status">
            <Lock size={24} aria-hidden="true" />
            <h4>{method === "paypal" ? "PayPal" : "Apple Pay"}</h4>
            <p>
              Continúa con {method === "paypal" ? "PayPal" : "Apple Pay"} para
              completar tu compra de prueba.
            </p>
            <small>
              Simulación · No se abrirá una cuenta ni se realizará ningún cargo.
            </small>
          </div>
        )}
        <div className="payment-glass-actions">{children}</div>
      </Card>
    </motion.div>
  );
}
