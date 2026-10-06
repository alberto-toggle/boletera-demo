import type { AccountState } from "./model";

export interface SavedPaymentMethod {
  id: string;
  ownerEmail: string;
  brand: "Visa" | "Mastercard";
  last4: string;
  expiry: string;
  isDefault: boolean;
}

export const paymentExamples = [
  { brand: "Visa", last4: "4242", expiry: "12/30" },
  { brand: "Mastercard", last4: "4444", expiry: "08/29" },
  { brand: "Visa", last4: "1881", expiry: "06/31" },
] as const;

export function savedPaymentMethods(state: AccountState): SavedPaymentMethod[] {
  return (
    state.paymentMethods ??
    paymentExamples.slice(0, 2).map((card, index) => ({
      ...card,
      id: `demo-card-${index}`,
      ownerEmail: "alex@example.com",
      isDefault: index === 0,
    }))
  );
}

export function addPaymentExample(
  state: AccountState,
  index: number,
  id: string,
): AccountState {
  const card = paymentExamples[index];
  const cards = savedPaymentMethods(state);
  if (
    !state.session ||
    !card ||
    !id ||
    cards.some(
      (c) =>
        c.id === id ||
        (c.ownerEmail === state.session &&
          c.last4 === card.last4 &&
          c.brand === card.brand),
    )
  ) {
    throw new Error("No se pudo agregar esta tarjeta de ejemplo.");
  }
  return {
    ...state,
    paymentMethods: [
      ...cards,
      {
        ...card,
        id,
        ownerEmail: state.session,
        isDefault: !cards.some((c) => c.ownerEmail === state.session),
      },
    ],
  };
}

export function changePaymentMethod(
  state: AccountState,
  id: string,
  action: "default" | "remove",
): AccountState {
  const cards = savedPaymentMethods(state);
  const card = cards.find((c) => c.id === id && c.ownerEmail === state.session);
  if (!card) throw new Error("Esta tarjeta no pertenece a tu cuenta.");
  if (action === "default")
    return {
      ...state,
      paymentMethods: cards.map((c) =>
        c.ownerEmail === state.session ? { ...c, isDefault: c.id === id } : c,
      ),
    };
  const remaining = cards.filter((c) => c.id !== id);
  const next = remaining.find((c) => c.ownerEmail === state.session);
  return {
    ...state,
    paymentMethods: remaining.map((c) =>
      card.isDefault && c.id === next?.id ? { ...c, isDefault: true } : c,
    ),
  };
}
