// Only this demo's keys; never clear unrelated browser storage.
export const DEMO_RESET_KEY = "boletera-demo-reset-v1";
const resetSeenKey = "boletera-demo-reset-seen-v1";
const sellerKey = "boletera-seller-demo-v1";
const localKeys = [
  "boletera-account-demo-v1",
  "boletera-immersive-palette",
  "boletera-demo-tools-visible",
];

export function reconcileDemoReset() {
  try {
    const version = localStorage.getItem(DEMO_RESET_KEY);
    if (version && sessionStorage.getItem(resetSeenKey) !== version) {
      sessionStorage.removeItem(sellerKey);
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
  const version = crypto.randomUUID();
  sessionStorage.setItem(resetSeenKey, version);
  localStorage.setItem(DEMO_RESET_KEY, version);
}
