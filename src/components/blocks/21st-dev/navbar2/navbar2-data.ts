import {
  FaXTwitter, // X
  FaInstagram, // Instagram
  FaLinkedin, // LinkedIn
  FaYoutube, // YouTube
  FaThreads, // Threads
  FaWhatsapp, // WhatsApp
} from "react-icons/fa6";

type MegaColumn = {
  eyebrow: string;
  links: { label: string; href: string; active?: boolean; badge?: string }[];
};

type MegaMenu = {
  columns: MegaColumn[];
  footerLinks?: { label: string; href: string }[];
  showSocials?: boolean;
  image: { src: string; alt: string };
  imageCaption?: string;
};

const SOLUTIONS_MENU: MegaMenu = {
  columns: [
    {
      eyebrow: "Our Solutions",
      links: [
        { label: "For employees", href: "#navbar2-preview", active: true },
        { label: "For businesses", href: "#navbar2-preview" },
      ],
    },
    {
      eyebrow: "Join us",
      links: [{ label: "Become a partner", href: "#navbar2-preview" }],
    },
  ],
  footerLinks: [
    { label: "Legal notice", href: "#navbar2-preview" },
    { label: "Privacy policy", href: "#navbar2-preview" },
    { label: "Terms of use", href: "#navbar2-preview" },
  ],
  showSocials: true,
  image: {
    src: "https://cdn.21st.dev/assets/mirror/c4/c42f90d9f657df788ec1c3ffd9782337299e15e56e2f1140a55885cd4d76a0ba.jpg",
    alt: "Solution preview",
  },
  imageCaption: "See how teams use Bag\\Ui",
};

const PRICING_MENU: MegaMenu = {
  columns: [
    {
      eyebrow: "Plans",
      links: [
        { label: "Starter", href: "#navbar2-preview" },
        { label: "Pro", href: "#navbar2-preview", active: true, badge: "Popular" },
        { label: "Enterprise", href: "#navbar2-preview" },
      ],
    },
    {
      eyebrow: "Details",
      links: [
        { label: "Compare all plans", href: "#navbar2-preview" },
        { label: "Billing FAQ", href: "#navbar2-preview" },
        { label: "Talk to sales", href: "#navbar2-preview" },
      ],
    },
  ],
  footerLinks: [
    { label: "Student & non-profit discounts", href: "#navbar2-preview" },
  ],
  image: {
    src: "https://cdn.21st.dev/assets/mirror/28/28584dcbc5517dcac47b439d7f23ff595a55fec0f3003734cb16edabc10aed27.jpg",
    alt: "Pricing preview",
  },
  imageCaption: "Plans that grow with your team",
};

const RESOURCES_MENU: MegaMenu = {
  columns: [
    {
      eyebrow: "Learn",
      links: [
        { label: "Blog", href: "#navbar2-preview" },
        { label: "Guides", href: "#navbar2-preview" },
        { label: "Webinars", href: "#navbar2-preview", badge: "New" },
      ],
    },
    {
      eyebrow: "Support",
      links: [
        { label: "Help center", href: "#navbar2-preview" },
        { label: "API documentation", href: "#navbar2-preview" },
        { label: "Community", href: "#navbar2-preview" },
      ],
    },
  ],
  footerLinks: [{ label: "Changelog", href: "#navbar2-preview" }],
  image: {
    src: "https://cdn.21st.dev/assets/mirror/45/4564df68598fcbfd357aeae49267e0f712e1e9ba66484f7f082ac26f1fd08fc9.jpg",
    alt: "Resources preview",
  },
  imageCaption: "Everything you need to get started",
};

export const MEGA_MENUS: Record<string, MegaMenu> = {
  Solutions: SOLUTIONS_MENU,
  Pricing: PRICING_MENU,
  Resources: RESOURCES_MENU,
};

export const NAV_ITEMS = [
  { label: "Solutions", hasMenu: true },
  { label: "Pricing", hasMenu: true },
  { label: "Resources", hasMenu: true },
  { label: "Contact", hasMenu: false, href: "#navbar2-preview" },
] as const;

export const LANGUAGES = [
  { code: "EN", label: "English" },
  { code: "FR", label: "Français" },
  { code: "ES", label: "Español" },
  { code: "DE", label: "Deutsch" },
] as const;

export const SOCIALS = [
  { href: "#navbar2-preview", label: "X", icon: FaXTwitter },
  { href: "#navbar2-preview", label: "Instagram", icon: FaInstagram },
  { href: "#navbar2-preview", label: "LinkedIn", icon: FaLinkedin },
  { href: "#navbar2-preview", label: "YouTube", icon: FaYoutube },
  { href: "#navbar2-preview", label: "Threads", icon: FaThreads },
  { href: "#navbar2-preview", label: "WhatsApp", icon: FaWhatsapp },
];
