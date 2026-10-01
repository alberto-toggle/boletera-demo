"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { motion, useReducedMotion } from "framer-motion";
import { Calendar, CreditCard, Lock } from "lucide-react";
import { useId, useState } from "react";

interface GlassCheckoutCardProps {
  amount?: number;
  className?: string;
}

export function GlassCheckoutCard({
  amount = 85.8,
  className,
}: GlassCheckoutCardProps) {
  const instanceId = useId();
  const reducedMotion = useReducedMotion();
  const [paymentMethod, setPaymentMethod] = useState("card");

  return (
    <motion.div
      initial={reducedMotion ? false : { opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className={cn("w-full max-w-[400px]", className)}
    >
      <Card className="group relative gap-0 py-0 overflow-hidden rounded-2xl border-border/50 bg-card/80 backdrop-blur-md transition-all duration-300 hover:border-primary/50 hover:shadow-xl hover:shadow-primary/10">
        <div className="p-6">
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-foreground">
              Payment Details
            </h2>
            <p className="text-sm text-muted-foreground">
              Explore payment methods with sample data
            </p>
          </div>

          {/* Payment Methods */}
          <div role="group" aria-label="Payment method" className="mb-6 grid grid-cols-3 gap-2">
            {["card", "paypal", "apple"].map((method) => (
              <button
                key={method}
                type="button"
                aria-label={method === "card" ? "Card" : method === "paypal" ? "PayPal" : "Apple Pay"}
                aria-pressed={paymentMethod === method}
                onClick={() => setPaymentMethod(method)}
                className={cn(
                  "flex h-12 items-center justify-center rounded-lg border border-border/50 bg-background/50 transition-all hover:bg-background/80 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
                  paymentMethod === method &&
                    "border-primary bg-primary/10 text-primary"
                )}
              >
                {method === "card" && <CreditCard className="h-5 w-5" />}
                {method === "paypal" && (
                  <span className="text-sm font-bold italic">PayPal</span>
                )}
                {method === "apple" && (
                  <span className="text-sm font-semibold">Apple Pay</span>
                )}
              </button>
            ))}
          </div>

          <div className="space-y-4" hidden={paymentMethod !== "card"}>
            <div className="space-y-2">
              <Label htmlFor={`${instanceId}-cardNumber`}>Card Number</Label>
              <div className="relative">
                <Input
                  id={`${instanceId}-cardNumber`}
                  autoComplete="off"
                  placeholder="4242 4242 4242 4242"
                  inputMode="numeric"
                  maxLength={23}
                  className="border-border/50 bg-background/50 pl-10 backdrop-blur-sm focus:border-primary/50 focus:bg-background/80"
                />
                <CreditCard className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor={`${instanceId}-expiry`}>Expiry Date</Label>
                <div className="relative">
                  <Input
                    id={`${instanceId}-expiry`}
                  autoComplete="off"
                    placeholder="MM/YY"
                    inputMode="numeric"
                    maxLength={5}
                    className="border-border/50 bg-background/50 pl-10 backdrop-blur-sm focus:border-primary/50 focus:bg-background/80"
                  />
                  <Calendar className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor={`${instanceId}-cvc`}>CVC</Label>
                <div className="relative">
                  <Input
                    id={`${instanceId}-cvc`}
                  autoComplete="off"
                    placeholder="123"
                    inputMode="numeric"
                    maxLength={4}
                    className="border-border/50 bg-background/50 pl-10 backdrop-blur-sm focus:border-primary/50 focus:bg-background/80"
                  />
                  <Lock className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor={`${instanceId}-name`}>Cardholder Name</Label>
              <Input
                id={`${instanceId}-name`}
                  autoComplete="off"
                placeholder="Alex Example"
                className="border-border/50 bg-background/50 backdrop-blur-sm focus:border-primary/50 focus:bg-background/80"
              />
            </div>
          </div>

          {paymentMethod !== "card" && (
            <p role="status" className="rounded-lg border border-dashed p-4 text-sm text-muted-foreground">
              {paymentMethod === "paypal" ? "PayPal" : "Apple Pay"} selected. This provider is not connected in the preview.
            </p>
          )}

          <Button disabled aria-describedby={`${instanceId}-preview-note`} className="mt-6 w-full bg-primary text-primary-foreground shadow-lg shadow-primary/20 transition-all hover:shadow-primary/40">
            Pay ${amount.toFixed(2)}
          </Button>

          <p id={`${instanceId}-preview-note`} className="mt-4 text-center text-xs text-muted-foreground">
            <Lock className="inline-block h-3 w-3 mr-1" />
            Preview only. No payment is processed.
          </p>
        </div>
      </Card>
    </motion.div>
  );
}
