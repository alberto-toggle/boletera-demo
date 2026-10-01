import ReceiptTiers from "./receipt-tiers";
import type { Plan } from "./receipt-tiers-utils/types";

const plans: Plan[] = [
  {
    id: "starter",
    name: "Starter",
    tagline: "For small crews shipping light loads",
    price: { monthly: 19, annual: 15 },
    cta: "Get Started",
    features: ["5 Projects", "Basic Analytics", "Email Support"],
  },
  {
    id: "growth",
    name: "Growth",
    tagline: "For teams scaling their operations",
    price: { monthly: 49, annual: 39 },
    cta: "Upgrade Now",
    badge: "Popular",
    features: [
      "Unlimited Projects",
      "Advanced Analytics",
      "Priority Support",
      "Team Roles",
    ],
  },
  {
    id: "enterprise",
    name: "Enterprise",
    tagline: "For fleets that need custom manifests",
    price: null,
    cta: "Contact Sales",
    features: [
      "Dedicated Manager",
      "Custom Contracts",
      "SLA Guarantee",
      "SSO & Audit Logs",
    ],
  },
];

export default function ReceiptTiersDemo() {
  return (
    <div className="w-full flex items-center justify-center">
      <ReceiptTiers
        eyebrow="Pricing"
        heading="Choose Your Plan"
        subheading="Simple pricing, no surprises on the bill"
        plans={plans}
        className="max-w-5xl"
      />
    </div>
  );
}

