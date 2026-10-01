"use client";

import ImmersiveFullscreenNav from "./immersive-full-screen-nav";

export default function ImmersiveFullscreenNavDemo() {
  // w-full + min-w-0: 21st's preview mounts demos inside a centering flex
  // wrapper. Without an explicit width, a block-level root there sizes to
  // its content instead of filling the wrapper — invisible on a light-mode
  // page (same white as the surrounding chrome) but a floating, inset white
  // box against dark mode's black chrome. See the same fix on
  // cards-rotate-slider's demo for the full mechanism.
  return (
    <div className="@container relative isolate h-[760px] w-full min-w-0 overflow-hidden rounded-xl">
      <ImmersiveFullscreenNav
        navConfig={{
          brand: "Northline",
          brandHref: "#immersive-preview",
          overlayBg: "#101014",
          clipOrigin: "left",
        }}
        navContent={{
          agencyName: "Northline Studio",
          tagline: "Brand and product design for early-stage teams.",
          location: "Lisbon, Portugal",
          links: [
            { label: "Work", href: "#immersive-preview" },
            { label: "Studio", href: "#immersive-preview" },
            { label: "Journal", href: "#immersive-preview" },
            { label: "Contact", href: "#immersive-preview" },
          ],
          images: [
            "https://cdn.21st.dev/assets/mirror/ba/baa678cbac1a29e773743a10ff421b226cf0e9b5d786ebf34415063d6dabc02b.jpg",
            "https://cdn.21st.dev/assets/mirror/ef/ef696854debc5d2d40cbe03ea0c3a04e29689529cf2f4bfe90c1c5978f00579a.jpg",
          ],
          socials: [
            { type: "instagram", href: "#immersive-preview" },
            { type: "twitter", href: "#immersive-preview" },
            { type: "linkedin", href: "#immersive-preview" },
          ],
        }}
      />

      <div className="flex h-full flex-col items-center justify-center gap-4 bg-white px-6 text-center text-black">
        <p className="text-xs uppercase tracking-[0.3em] text-black/40">Navigation</p>
        <h2 className="max-w-2xl text-[7cqw] leading-tight @max-md:text-[9cqw]">Immersive Full Screen Nav</h2>
        <p className="mt-2 max-w-md text-sm leading-relaxed text-black/60">
          Click the menu button — the panel wipes open via clip-path, then the brand block, links, images, and
          socials reveal in sequence.
        </p>
      </div>
    </div>
  );
}

