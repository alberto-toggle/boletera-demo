"use client";
import { useEffect, useState } from "react";
// Refresh chronological lists while the account stays open. Transfer mutations
// still re-check the exact current time independently.
export function useAccountClock() {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const timer = window.setInterval(() => setNow(Date.now()), 30_000);
    return () => window.clearInterval(timer);
  }, []);
  return now;
}
