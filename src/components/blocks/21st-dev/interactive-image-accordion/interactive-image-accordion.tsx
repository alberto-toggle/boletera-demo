"use client";
import { useState } from "react";
import Image from "next/image";
import { accordionItems, type ImageAccordionItem } from "./interactive-image-accordion-data";

// --- Accordion Item Component ---
const AccordionItem = ({ item, isActive, onSelect }: { item: ImageAccordionItem; isActive: boolean; onSelect: () => void }) => {
  const [failed, setFailed] = useState(false);
  return (
    <button
      type="button"
      aria-pressed={isActive}
      aria-label={item.title}
      className={`
        relative shrink-0 h-[450px] rounded-2xl focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-900 overflow-hidden cursor-pointer
        motion-reduce:transition-none transition-all duration-700 ease-in-out
        ${isActive ? "w-[400px]" : "w-[60px]"}
      `}
      onMouseEnter={onSelect}
      onFocus={onSelect}
      onClick={onSelect}
    >
      {/* Background Image */}
      <Image
        src={failed ? "https://cdn.21st.dev/assets/mirror/20/202ffce6b7b0033fa5516a872cec215e4edbb8d25bc98a77988cfb950fffdb9e.svg" : item.imageUrl}
        alt=""
        fill
        unoptimized
        sizes="400px"
        className="object-cover"
        onError={() => setFailed(true)}
      />
      {/* Dark overlay for better text readability */}
      <span className="absolute inset-0 bg-black/40" />

      {/* Caption Text */}
      <span
        className={`
          absolute text-white text-lg font-semibold whitespace-nowrap
          motion-reduce:transition-none transition-all duration-300 ease-in-out
          ${
            isActive
              ? "bottom-6 left-1/2 -translate-x-1/2 rotate-0" // Active state: horizontal, bottom-center
              : // Inactive state: vertical, positioned at the bottom, for all screen sizes
                "w-auto text-left bottom-24 left-1/2 -translate-x-1/2 rotate-90"
          }
        `}
      >
        {item.title}
      </span>
    </button>
  );
};

// --- Main App Component ---
export function LandingAccordionItem() {
  const [activeIndex, setActiveIndex] = useState(4);

  const [contactMessage, setContactMessage] = useState(false);
  const handleItemHover = (index: number) => {
    setActiveIndex(index);
  };

  return (
    <div className="@container rounded-xl bg-white font-sans">
      <section className="container mx-auto px-4 py-12 @min-[1000px]:py-24">
        <div className="flex flex-col @min-[1000px]:flex-row items-center justify-between gap-12">
          {/* Left Side: Text Content */}
          <div className="w-full @min-[1000px]:w-1/2 text-center @min-[1000px]:text-left">
            <h2 className="text-4xl @min-[1000px]:text-6xl font-bold text-gray-900 leading-tight tracking-tighter">
              Accelerate Gen-AI Tasks on Any Device
            </h2>
            <p className="mt-6 text-lg text-gray-600 max-w-xl mx-auto @min-[1000px]:mx-0">
              Build high-performance AI apps on-device without the hassle of
              model compression or edge deployment.
            </p>
            <div className="mt-8">
              <button
                type="button"
                onClick={() => setContactMessage(true)}
                className="inline-block bg-gray-900 text-white font-semibold px-8 py-3 rounded-lg shadow-lg hover:bg-gray-800 transition-colors duration-300"
              >
                Contact Us
              </button>
              {contactMessage && <p role="status" className="mt-3 text-sm text-gray-600">Contacto de demostración. No se ha enviado ninguna solicitud.</p>}
            </div>
          </div>

          {/* Right Side: Image Accordion */}
          <div className="w-full @min-[1000px]:w-1/2">
            {/* Changed flex-col to flex-row to keep the layout consistent */}
            <div className="flex flex-row items-center justify-start gap-4 overflow-x-auto p-4">
              {accordionItems.map((item, index) => (
                <AccordionItem
                  key={item.id}
                  item={item}
                  isActive={index === activeIndex}
                  onSelect={() => handleItemHover(index)}
                />
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default LandingAccordionItem;
