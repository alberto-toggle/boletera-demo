export interface Plan {
  id: string;
  name: string;
  tagline: string;
  /** Monthly rates: regular and discounted with annual billing. */
  price: { monthly: number; annual: number } | null;
  cta: string;
  badge?: string;
  features: string[];
}
