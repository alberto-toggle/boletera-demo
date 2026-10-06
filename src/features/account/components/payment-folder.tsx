"use client";
// Adapted from BE UI Card Folder by Saurabh — see ../README.md.
import { useEffect, useState } from "react";
import {
  animate,
  motion,
  useMotionValue,
  useReducedMotion,
  useTransform,
} from "framer-motion";
import { CreditCard, Wifi } from "lucide-react";
import type { SavedPaymentMethod } from "../payment-methods";

export function PaymentFolder({
  card,
  name,
}: {
  card: SavedPaymentMethod;
  name: string;
}) {
  const [open, setOpen] = useState(false);
  const reduce = useReducedMotion();
  const progress = useMotionValue(0);
  const cardTransform = useTransform(progress, (v) => {
    const lift = Math.sin(Math.PI * Math.min(1, Math.max(0, v)));
    return `translateY(${-8 * lift}%) scale(${1 + 0.01 * lift})`;
  });
  const backTransform = useTransform(
    progress,
    [0, 1],
    ["translateY(0%) scaleY(1)", "translateY(18%) scaleY(0.18)"],
  );
  const frontTransform = useTransform(
    progress,
    [0, 1],
    ["translateY(0%) rotateX(0deg)", "translateY(18%) rotateX(-72deg)"],
  );
  const opacity = useTransform(progress, [0, 0.76, 1], [1, 1, 0]);
  useEffect(() => {
    const controls = animate(
      progress,
      open ? 1 : 0,
      reduce ? { duration: 0 } : { duration: 0.28, ease: [0.77, 0, 0.175, 1] },
    );
    return () => controls.stop();
  }, [open, progress, reduce]);
  return (
    <button
      type="button"
      className="payment-folder"
      aria-expanded={open}
      aria-label={`${open ? "Cerrar" : "Abrir"} ${card.brand} terminada en ${card.last4}`}
      onClick={() => setOpen(!open)}
    >
      <motion.span
        className="payment-folder-back"
        style={{ opacity, transform: backTransform }}
      />
      <motion.span
        className={`payment-folder-card ${card.brand === "Visa" ? "payment-visa" : "payment-mastercard"}`}
        style={{ transform: reduce ? undefined : cardTransform }}
      >
        <span className="payment-card-top">
          BOLETERA <Wifi size={20} aria-hidden="true" />
        </span>
        <CreditCard size={34} className="payment-chip" aria-hidden="true" />
        <span className="payment-card-number">•••• •••• •••• {card.last4}</span>
        <span className="payment-card-bottom">
          <span>
            {name}
            <small>{card.expiry}</small>
          </span>
          <strong>{card.brand}</strong>
        </span>
      </motion.span>
      <motion.span
        className="payment-folder-front"
        aria-hidden="true"
        style={{ opacity, transform: frontTransform }}
      >
        <svg
          aria-hidden="true"
          viewBox="0 0 384 110"
          preserveAspectRatio="none"
          className="absolute inset-0 size-full overflow-visible"
        >
          <path
            d="M0 17C15 7 31 4 49 4H87C110 4 126 17 144 32L158 44C176 59 206 59 225 43L240 30C257 16 271 4 295 4H335C354 4 370 8 384 18V94C384 103 377 110 368 110H16C7 110 0 103 0 94Z"
            fill="var(--background)"
            stroke="var(--foreground)"
            strokeOpacity="0.12"
            vectorEffect="non-scaling-stroke"
          />
          <path
            d="M10 21C22 13 35 11 51 11H85C105 11 120 23 137 37L153 50C175 68 208 68 231 49L246 36C262 23 275 11 297 11H333C350 11 363 14 374 22V89C374 97 369 101 360 101H24C15 101 10 96 10 89Z"
            fill="none"
            stroke="var(--foreground)"
            strokeDasharray="5 5"
            strokeLinecap="round"
            strokeOpacity="0.22"
            vectorEffect="non-scaling-stroke"
          />
        </svg>
        <span className="payment-sleeve-copy">
          <span>
            {card.brand}
            <small>•••• {card.last4}</small>
          </span>
          <span>
            Vence<small>{card.expiry}</small>
          </span>
        </span>
      </motion.span>
    </button>
  );
}
