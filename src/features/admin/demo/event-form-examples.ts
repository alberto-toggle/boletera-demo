import { venueForLayout } from "@/domain/venues/catalog";
import type { AdminEvent } from "../model";
import { zonesForLayout } from "./fixtures";

type EventExample = Pick<
  AdminEvent,
  | "title"
  | "category"
  | "startsAt"
  | "venue"
  | "description"
  | "includes"
  | "layout"
  | "zones"
  | "image"
  | "images"
>;

export const eventFormExamples: Record<AdminEvent["category"], EventExample> = {
  "Cena baile": {
    image: "/images/events/banquet.jpg",
    images: [
      {
        id: "demo-banquet",
        src: "/images/events/banquet.jpg",
        name: "Salón preparado para la cena",
        width: 1800,
        height: 1163,
      },
      {
        id: "demo-dinner",
        src: "/images/events/dinner.jpg",
        name: "Cena y ambientación",
        width: 1800,
        height: 1202,
      },
    ],
    title: "Noche de gala y tradición",
    category: "Cena baile",
    startsAt: "2027-09-18T19:00:00-06:00",
    venue: venueForLayout("banquet").name,
    description:
      "Comparte una noche especial con música en vivo, gastronomía mexicana y una pista de baile para disfrutar en compañía. Te recibiremos con una cena de tres tiempos, seguida de la presentación de una orquesta que recorrerá los grandes clásicos. Elige tu mesa y celebra con familiares y amigos en un ambiente cálido y elegante. La recepción comienza a las 19:00 horas; te recomendamos llegar con anticipación para encontrar tu lugar con tranquilidad.",
    includes: [
      "Cena de tres tiempos",
      "Orquesta en vivo",
      "Mesa y lugar asignados",
      "Acceso a la pista de baile",
    ],
    layout: "banquet",
    zones: zonesForLayout("banquet", 125000),
  },
  Evento: {
    image: "/images/events/concert.jpg",
    images: [
      {
        id: "demo-concert",
        src: "/images/events/concert.jpg",
        name: "Música en vivo",
        width: 1800,
        height: 1200,
      },
      {
        id: "demo-celebration",
        src: "/images/events/celebration.jpg",
        name: "Un encuentro para celebrar",
        width: 1800,
        height: 1201,
      },
    ],
    title: "Concierto: Raíces de México",
    category: "Evento",
    startsAt: "2027-10-16T18:00:00-06:00",
    venue: venueForLayout("auditorium").name,
    description:
      "Disfruta un recorrido musical por las tradiciones de México en un concierto para compartir en familia. Una selección de músicos invitados interpretará piezas emblemáticas y arreglos contemporáneos que celebran nuestra identidad. La función tendrá una duración aproximada de noventa minutos, con localidades numeradas para que disfrutes cada momento desde tu asiento. Las puertas abren treinta minutos antes del inicio; presenta tu boleto al ingresar.",
    includes: [
      "Acceso al concierto",
      "Asiento numerado",
      "Programa digital de la función",
    ],
    layout: "auditorium",
    zones: zonesForLayout("auditorium", 45000),
  },
};

export function applyEventExample(
  draft: AdminEvent,
  category: AdminEvent["category"],
): AdminEvent {
  const example = eventFormExamples[category];
  if (draft.id) {
    return {
      ...draft,
      image: draft.image || example.image,
      images: draft.images?.length
        ? draft.images
        : example.images?.map((image) => ({ ...image })),
      title: draft.title.trim() ? draft.title : example.title,
      description: draft.description.trim()
        ? draft.description
        : example.description,
      includes: draft.includes.some((item) => item.trim())
        ? draft.includes
        : [...example.includes],
      venue: draft.venue.trim() ? draft.venue : example.venue,
      startsAt: draft.startsAt || example.startsAt,
    };
  }
  return {
    ...draft,
    ...example,
    images: example.images?.map((image) => ({ ...image })),
    includes: [...example.includes],
    zones: example.zones.map((zone) => ({ ...zone })),
  };
}
