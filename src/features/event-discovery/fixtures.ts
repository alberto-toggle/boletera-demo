import { venueCatalog } from "@/domain/venues/catalog";
import type { DiscoveryEvent } from "./model";

// All names, venues, dates, prices and inclusions are illustrative, not confirmed requirements.
const common = { city: "Ciudad de México" } as const;
export const featuredEvent: DiscoveryEvent = {
  ...common,
  id: "noche-independencia",
  title: "Noche de Independencia",
  category: "Cena baile",
  startsAt: "2027-09-15T19:00:00-06:00",
  venue: venueCatalog[0].name,
  price: { amountMinor: 125000, currency: "MXN" },
  image: "/images/events/architecture.jpg",
  imageAlt: "Papel picado de colores sobre una fachada histórica mexicana",
  description:
    "Una noche para celebrar nuestras raíces. Gastronomía mexicana, música en vivo y un encuentro que reúne tradición, familia y nuevos recuerdos.",
  includes: [
    "Cena de tres tiempos",
    "Música en vivo",
    "Lugar asignado en mesa",
  ],
};

// Canonical chronological order for all four demos. Heroes use featuredEvent,
// which is the same object included below, including its image and crop.
export const demoEvents: readonly DiscoveryEvent[] = [
  {
    ...common,
    id: "dia-ejercito",
    title: "Día del Ejército",
    category: "Evento",
    startsAt: "2027-02-19T13:00:00-06:00",
    venue: venueCatalog[1].name,
    price: { amountMinor: 65000, currency: "MXN" },
    image: "/images/events/dia-ejercito.jpg",
    imageAlt:
      "Silueta de un soldado saludando junto a la bandera de México sobre una cima rocosa",
    imagePosition: "65% 50%",
    description:
      "Un encuentro para reconocer la vocación de servicio y compartir una tarde con quienes forman parte de nuestra comunidad.",
    includes: [
      "Presentación musical",
      "Programa conmemorativo",
      "Lugar asignado",
    ],
  },
  {
    ...common,
    id: "encuentro-familias",
    title: "Encuentro de familias",
    category: "Evento",
    startsAt: "2027-04-24T12:00:00-06:00",
    venue: venueCatalog[1].name,
    price: { amountMinor: 35000, currency: "MXN" },
    image: "/images/events/dinner.jpg",
    imageAlt: "Mesa decorada con flores y copas para un encuentro",
    description:
      "Una tarde para compartir en familia, disfrutar de presentaciones artísticas y reencontrarnos en un ambiente cercano.",
    includes: [
      "Presentaciones artísticas",
      "Actividades de convivencia",
      "Asiento numerado",
    ],
  },
  {
    ...common,
    id: "cena-primavera",
    title: "Cena-baile de primavera",
    category: "Cena baile",
    startsAt: "2027-05-22T19:00:00-06:00",
    venue: venueCatalog[0].name,
    price: { amountMinor: 95000, currency: "MXN" },
    image: "/images/events/guests-celebration.jpg",
    imageAlt:
      "Invitados reunidos alrededor de mesas en un salón de celebración",
    description:
      "Buena música, una cena especial y toda una noche para bailar. Celebremos juntos una nueva temporada.",
    includes: [
      "Cena de tres tiempos",
      "Orquesta en vivo",
      "Lugar asignado en mesa",
    ],
  },
  {
    ...common,
    id: "encuentro-liderazgo",
    title: "Voces que inspiran",
    category: "Evento",
    startsAt: "2027-07-16T10:00:00-06:00",
    venue: venueCatalog[1].name,
    price: { amountMinor: 25000, currency: "MXN" },
    image: "/images/events/concert.jpg",
    imageAlt: "Micrófono iluminado en un escenario",
    description:
      "Conversaciones sobre liderazgo, comunidad y servicio. Un espacio para escuchar nuevas perspectivas y conectar ideas.",
    includes: [
      "Acceso a las conferencias",
      "Pausa de café",
      "Lugar en auditorio",
    ],
  },
  featuredEvent,
  {
    ...common,
    id: "noche-tradiciones",
    title: "Noche de tradiciones",
    category: "Cena baile",
    startsAt: "2027-11-02T18:00:00-06:00",
    venue: venueCatalog[0].name,
    price: { amountMinor: 75000, currency: "MXN" },
    image: "/images/events/catrina-tradition.jpg",
    imageAlt:
      "Mujer caracterizada de catrina junto a una ofrenda iluminada con velas",
    imagePosition: "68% 50%",
    description:
      "Sabores, historias y música que mantienen vivas nuestras tradiciones. Una celebración para recordar y compartir.",
    includes: ["Cena temática", "Presentación musical", "Recorrido cultural"],
  },
  {
    ...common,
    id: "reconocimientos",
    title: "Una vida de servicio",
    category: "Evento",
    startsAt: "2027-11-20T18:00:00-06:00",
    venue: venueCatalog[1].name,
    price: { amountMinor: 85000, currency: "MXN" },
    image: "/images/events/uniforme-mexico.jpg",
    imageAlt:
      "Detalle de uniforme ceremonial con bordado MÉXICO y cordón dorado",
    imagePosition: "50% 45%",
    description:
      "Una ceremonia de reconocimientos dedicada a las personas cuyas historias y compromiso dejan huella en nuestra comunidad.",
    includes: [
      "Ceremonia de reconocimientos",
      "Programa conmemorativo",
      "Asiento numerado",
    ],
  },
  {
    ...common,
    id: "posada",
    title: "La gran posada",
    category: "Cena baile",
    startsAt: "2027-12-18T18:00:00-06:00",
    venue: venueCatalog[0].name,
    price: { amountMinor: 70000, currency: "MXN" },
    image: "/images/events/dinner.jpg",
    imageAlt: "Decoración y mesas para una velada de celebración",
    description:
      "Las tradiciones de diciembre nos reúnen. Una velada cálida de música, cena y momentos para disfrutar en familia.",
    includes: ["Cena de temporada", "Música en vivo", "Actividades familiares"],
  },
  {
    ...common,
    id: "ano-nuevo",
    title: "Bienvenido, 2028",
    category: "Cena baile",
    startsAt: "2027-12-31T20:00:00-06:00",
    venue: venueCatalog[0].name,
    price: { amountMinor: 165000, currency: "MXN" },
    image: "/images/events/celebration.jpg",
    imageAlt: "Luces de celebración en una noche de fiesta",
    description:
      "Despidamos el año con una cena especial, baile y el primer brindis de una nueva historia. Lo mejor está por venir.",
    includes: ["Cena de gala", "Brindis de medianoche", "Música y baile"],
  },
];
