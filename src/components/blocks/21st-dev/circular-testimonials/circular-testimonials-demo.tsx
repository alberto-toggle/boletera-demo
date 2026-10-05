import React from "react";
import {
  CircularTestimonials,
  type Testimonial,
} from "./circular-testimonials";

const testimonials: Testimonial[] = [
  {
    quote:
      "I was impressed by the food! And I could really tell that they use high-quality ingredients. The staff was friendly and attentive. I'll definitely be back for more!",
    name: "Tamar Mendelson",
    designation: "Restaurant Critic",
    src: "https://cdn.21st.dev/assets/mirror/02/0204be31ac91de05dc9a78ea3438dda481ff3deaaffa40cb28e3bc1822ba3650.jpg",
  },
  {
    quote:
      "This place exceeded all expectations! The atmosphere is inviting, and the staff truly goes above and beyond. I'll keep returning for more exceptional dining experience.",
    name: "Joe Charlescraft",
    designation: "Frequent Visitor",
    src: "https://cdn.21st.dev/assets/mirror/bb/bb5e69602eca31b29b15db66d5f95f5d6e1534037d1cc2c06e8cbb22cafb3a8f.jpg",
  },
  {
    quote:
      "Shining Yam is a hidden gem! The impeccable service and overall attention to detail created a memorable experience. I highly recommend it!",
    name: "Martina Edelweist",
    designation: "Satisfied Customer",
    src: "https://cdn.21st.dev/assets/mirror/b1/b1e3120d49307c1e99ec979e6d05e79f67d7ecea727b27eb716a2b7bff5fe0bb.jpg",
  },
];

export const CircularTestimonialsDemo = () => (
  <section lang="en" className="space-y-6">
    {/* Light testimonials section */}
    <div className="bg-[#f7f7fa] px-3 py-8 sm:px-8 rounded-lg min-h-[300px] flex flex-wrap gap-6 items-center justify-center relative">
      <div
        className="w-full min-w-0 items-center justify-center relative flex"
        style={{ maxWidth: "1456px" }}
      >
        <CircularTestimonials
          testimonials={testimonials}
          autoplay={false}
          colors={{
            name: "#0a0a0a",
            designation: "#454545",
            testimony: "#171717",
            arrowBackground: "#141414",
            arrowForeground: "#f1f1f7",
            arrowHoverBackground: "#00A6FB",
          }}
          fontSizes={{
            name: "28px",
            designation: "20px",
            quote: "20px",
          }}
        />
      </div>
    </div>

    {/* Dark testimonials section */}
    <div className="bg-[#060507] px-3 py-8 sm:px-8 rounded-lg min-h-[300px] flex flex-wrap gap-6 items-center justify-center relative">
      <div
        className="w-full min-w-0 items-center justify-center relative flex"
        style={{ maxWidth: "1024px" }}
      >
        <CircularTestimonials
          testimonials={testimonials}
          autoplay={false}
          colors={{
            name: "#f7f7ff",
            designation: "#e1e1e1",
            testimony: "#f1f1f7",
            arrowBackground: "#0582CA",
            arrowForeground: "#141414",
            arrowHoverBackground: "#f7f7ff",
          }}
          fontSizes={{
            name: "28px",
            designation: "20px",
            quote: "20px",
          }}
        />
      </div>
    </div>
  </section>
);
