"use client";
import { useMemo, useSyncExternalStore } from "react";
import type { Buyer } from "../booking/model";
import { initialAccountState } from "./fixtures";
import { normalizeEmail, type AccountState } from "./model";
import { isAccountState } from "./validation";
const key = "boletera-account-demo-v1";
const change = "boletera-account-change";
let memory = "";
let memoryOnly = false;
function snapshot() {
  try {
    if (!memoryOnly) memory = localStorage.getItem(key) ?? "";
  } catch {
    /* Memory fallback in private mode. */
  }
  if (!memory) memory = JSON.stringify(initialAccountState());
  return memory;
}
function decode(value: string): AccountState {
  try {
    const parsed: unknown = JSON.parse(value);
    if (isAccountState(parsed)) return parsed;
  } catch {
    /* Discard malformed demo data. */
  }
  return initialAccountState();
}
function subscribe(fn: () => void) {
  window.addEventListener(change, fn);
  window.addEventListener("storage", fn);
  return () => {
    window.removeEventListener(change, fn);
    window.removeEventListener("storage", fn);
  };
}
export function useAccount() {
  const raw = useSyncExternalStore(subscribe, snapshot, () => "");
  const state = useMemo(() => decode(raw), [raw]);
  return {
    state,
    ready: raw !== "",
    user: state.users.find((u) => u.email === state.session) ?? null,
  };
}
export function updateAccount(update: (state: AccountState) => AccountState) {
  const next = update(decode(snapshot()));
  memory = JSON.stringify(next);
  try {
    localStorage.setItem(key, memory);
  } catch {
    memoryOnly = true; // Preserve updates if storage is full or blocked.
  }
  window.dispatchEvent(new Event(change));
}
export function signIn(buyer: Buyer) {
  const email = normalizeEmail(buyer.email);
  updateAccount((s) => ({
    ...s,
    session: email,
    users: s.users.some((u) => u.email === email)
      ? s.users
      : [
          ...s.users,
          { ...buyer, email, contactChannel: "email", verifiedContact: email },
        ],
  }));
}
export function signOut() {
  updateAccount((s) => ({ ...s, session: null }));
}
