import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: "/playground/aportados/receipt-tiers",
        destination: "/playground/21st-dev/receipt-tiers",
        permanent: false,
      },
      {
        source: "/playground/aportados/feature-sections",
        destination: "/playground/21st-dev/feature-sections",
        permanent: false,
      },
      {
        source: "/playground/aportados/ticket-confirmation-card",
        destination: "/playground/21st-dev/ticket-confirmation-card",
        permanent: false,
      },
      {
            "source": "/playground/shadcn-io-calendar-event-details",
            "destination": "/playground/shadcn-io/calendar-event-details",
            "permanent": false
      },
      {
            "source": "/playground/shadcn-io-checkout-event-tickets",
            "destination": "/playground/shadcn-io/checkout-event-tickets",
            "permanent": false
      },
      {
            "source": "/playground/shadcn-io-footer-event",
            "destination": "/playground/shadcn-io/footer-event",
            "permanent": false
      },
      {
            "source": "/playground/shadcn-io-music-concert-countdown",
            "destination": "/playground/shadcn-io/music-concert-countdown",
            "permanent": false
      },
      {
            "source": "/playground/shadcn-io-music-concert-tickets",
            "destination": "/playground/shadcn-io/music-concert-tickets",
            "permanent": false
      },
      {
            "source": "/playground/shadcn-io-product-card-event",
            "destination": "/playground/shadcn-io/product-card-event",
            "permanent": false
      },
      {
            "source": "/playground/shadcn-io-product-card-virtual-event",
            "destination": "/playground/shadcn-io/product-card-virtual-event",
            "permanent": false
      },
      {
            "source": "/playground/kibo-ui-credit-card",
            "destination": "/playground/kibo-ui/credit-card",
            "permanent": false
      }
];
  },
};

export default nextConfig;
