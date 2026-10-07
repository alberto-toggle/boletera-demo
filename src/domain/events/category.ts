/** Categorías confirmadas por el cliente. No confundir con la distribución del recinto. */
export const eventCategories = ["Evento", "Cena baile"] as const;
export type EventCategory = (typeof eventCategories)[number];
export function isEventCategory(value: unknown): value is EventCategory {
  return eventCategories.some((category) => category === value);
}
/** Compatibilidad con registros de la demo anteriores a la corrección del catálogo. */
export function migrateDemoCategory(key: string, value: unknown): unknown {
  if (key !== "category") return value;
  if (value === "Celebraciones") return "Cena baile";
  if (value === "Ceremonias" || value === "Encuentros") return "Evento";
  return value;
}
