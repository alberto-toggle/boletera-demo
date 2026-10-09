// Only this demo's keys; never clear unrelated browser storage.
export const DEMO_RESET_KEY = "boletera-demo-reset-v1";
const resetSeenKey = "boletera-demo-reset-seen-v1";
const sellerKey = "boletera-seller-demo-v1";
const localKeys = [
  "boletera-admin-demo-v1",
  "boletera-access-demo-v1",
  "boletera-admin-holds-v1",
  "boletera-account-demo-v1",
  "boletera-immersive-palette",
  "boletera-demo-tools-visible",
  "boletera-demo-appearance",
];

export function reconcileDemoReset() {
  try {
    const version = localStorage.getItem(DEMO_RESET_KEY);
    if (version && sessionStorage.getItem(resetSeenKey) !== version) {
      sessionStorage.removeItem(sellerKey);
      sessionStorage.removeItem("boletera-admin-session-v1");
      sessionStorage.removeItem("boletera-staff-session-v1");
      sessionStorage.setItem(resetSeenKey, version);
      return true;
    }
  } catch {
    /* Normal storage fallbacks remain available. */
  }
  return false;
}

export function resetDemoData() {
  localKeys.forEach((key) => localStorage.removeItem(key));
  sessionStorage.removeItem(sellerKey);
  sessionStorage.removeItem("boletera-admin-session-v1");
  sessionStorage.removeItem("boletera-staff-session-v1");
  const version = crypto.randomUUID();
  sessionStorage.setItem(resetSeenKey, version);
  localStorage.setItem(DEMO_RESET_KEY, version);
}
