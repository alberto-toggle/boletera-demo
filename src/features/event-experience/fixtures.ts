import type {
  DiscoveryEvent,
  EventCategory,
} from "@/features/event-discovery/model";
import type { EventExperience, EventPhoto, PastEvent } from "./model";
// Illustrative content for the demo; not confirmed venue policies or real archives.
const photos: readonly EventPhoto[] = [
  {
    src: "/images/events/banquet.jpg",
    alt: "Salón preparado con mesas redondas",
    caption: "Un espacio para compartir",
  },
  {
    src: "/images/events/dinner.jpg",
    alt: "Mesa decorada con flores y copas",
    caption: "Cada detalle cuenta",
  },
  {
    src: "/images/events/concert.jpg",
    alt: "Escenario iluminado durante una presentación",
    caption: "Momentos que se escuchan y se sienten",
  },
  {
    src: "/images/events/celebration.jpg",
    alt: "Luces de una celebración",
    caption: "Una noche para recordar",
  },
];
const profiles: Record<EventCategory, Omit<EventExperience, "photos">> = {
  Celebraciones: {
    introduction:
      "Una bienvenida cálida, buena mesa y música para acompañar el encuentro. La velada está pensada para disfrutar sin prisa, brindar y compartir con quienes eliges.",
    dressCode: "Formal o de cóctel, sugerido para esta demo.",
    arrival: "Llega 30 minutos antes para ubicar tu mesa con tranquilidad.",
    accessibility:
      "Consulta con la organización los apoyos de acceso antes del evento; servicios por confirmar.",
    program: [
      {
        offsetMinutes: -30,
        title: "Las puertas se abren",
        description: "Bienvenida y ubicación de los asistentes.",
      },
      {
        offsetMinutes: 0,
        title: "Comienza el encuentro",
        description: "Recepción y apertura del programa.",
      },
      {
        offsetMinutes: 60,
        title: "A la mesa",
        description: "Servicio de cena y convivencia.",
      },
      {
        offsetMinutes: 120,
        title: "La noche es de todos",
        description: "Música en vivo y celebración.",
      },
    ],
  },
  Ceremonias: {
    introduction:
      "Un encuentro para reconocer historias, trayectorias y vocación de servicio. Un programa conmemorativo que pone a las personas y a sus familias en el centro.",
    dressCode: "Formal, sugerido para esta demo.",
    arrival: "Llega 30 minutos antes del inicio del programa.",
    accessibility:
      "Los apoyos de movilidad y acceso deberán confirmarse con la organización.",
    program: [
      {
        offsetMinutes: -30,
        title: "Recepción",
        description: "Ingreso y ubicación de asistentes.",
      },
      {
        offsetMinutes: 0,
        title: "Bienvenida",
        description: "Apertura del programa conmemorativo.",
      },
      {
        offsetMinutes: 40,
        title: "El momento de reconocer",
        description: "Ceremonia y entrega de reconocimientos.",
      },
      {
        offsetMinutes: 90,
        title: "Un encuentro para compartir",
        description: "Convivencia y cierre de la jornada.",
      },
    ],
  },
  Encuentros: {
    introduction:
      "Un espacio para conversar, compartir ideas y encontrarnos en comunidad. Actividades y momentos de convivencia en un ambiente cercano.",
    dressCode: "Cómodo o casual de vestir, sugerido para esta demo.",
    arrival: "Considera llegar 20 minutos antes para tu registro.",
    accessibility:
      "Consulta necesidades de acceso con la organización. La sede de esta demo es ficticia.",
    program: [
      {
        offsetMinutes: -20,
        title: "Te damos la bienvenida",
        description: "Recepción y registro de asistentes.",
      },
      {
        offsetMinutes: 0,
        title: "El punto de encuentro",
        description: "Apertura y presentación del programa.",
      },
      {
        offsetMinutes: 45,
        title: "Compartir nos acerca",
        description: "Actividad principal y participación.",
      },
      {
        offsetMinutes: 120,
        title: "Sigamos la conversación",
        description: "Convivencia y despedida.",
      },
    ],
  },
};
export function getEventExperience(event: DiscoveryEvent): EventExperience {
  return {
    ...profiles[event.category],
    photos: [
      { src: event.image, alt: event.imageAlt, caption: event.title },
      ...(event.id === "dia-ejercito"
        ? [
            {
              src: "/images/events/saludo-bandera.jpg",
              alt: "Militar con boina verde saludando de espaldas ante la bandera mexicana",
              caption: "Honor y compromiso",
            },
            {
              src: "/images/events/soldier-community.jpg",
              alt: "Soldado junto a vehículos del Ejército Mexicano frente a un edificio histórico",
              caption: "Una mirada al Ejército Mexicano",
            },
          ]
        : []),
      ...(event.id === "reconocimientos"
        ? [
            {
              src: "/images/events/honor-bandera.jpg",
              alt: "Composición de una silueta militar saludando y la bandera mexicana sobre fondo blanco",
              caption: "Una vida dedicada al servicio",
            },
          ]
        : []),
      ...photos.filter((photo) => photo.src !== event.image),
    ],
  };
}
export const pastEvents: readonly PastEvent[] = [
  {
    id: "independencia-2026",
    date: "15 SEP · 2026",
    title: "Una noche, muchas historias.",
    description:
      "La música, los brindis y una mesa compartida. Así imaginamos una edición anterior de nuestra Noche de Independencia.",
    image: "/images/events/architecture.jpg",
    alt: "Papel picado sobre una fachada mexicana",
  },
  {
    id: "reconocimientos-2026",
    date: "20 NOV · 2026",
    title: "El orgullo de reconocer.",
    description:
      "Una ceremonia dedicada a las personas que inspiran a nuestra comunidad. Una memoria ilustrativa de la temporada anterior.",
    image: "/images/events/banquet.jpg",
    alt: "Salón de recepción iluminado",
  },
  {
    id: "posada-2026",
    date: "18 DIC · 2026",
    title: "Cerrar el año, juntos.",
    description:
      "El reencuentro, una cena especial y los buenos deseos para lo que viene. Una edición de ejemplo para recordar.",
    image: "/images/events/dinner.jpg",
    alt: "Mesa de celebración con flores",
  },
];
