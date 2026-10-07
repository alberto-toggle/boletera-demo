"use client";
import styles from "./rolling-digits.module.css";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";

export function RollingDigits({ value }: { value: string }) {
  const reduce = useReducedMotion();
  return (
    <span className={styles.digits} aria-hidden="true">
      {Array.from(value).map((digit, index) =>
        digit === ":" ? (
          <span key={index} className={styles.colon}>
            :
          </span>
        ) : (
          <span className={styles.digit} key={index}>
            <AnimatePresence initial={false}>
              <motion.span
                key={digit}
                initial={{ y: reduce ? 0 : "-100%", opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: reduce ? 0 : "100%", opacity: 0 }}
                transition={{ duration: reduce ? 0 : 0.24, ease: "easeInOut" }}
              >
                {digit}
              </motion.span>
            </AnimatePresence>
          </span>
        ),
      )}
    </span>
  );
}
