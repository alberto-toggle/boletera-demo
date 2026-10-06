import type { DemoVenue } from "./fixtures";

export interface MapBox {
  x: number;
  y: number;
  width: number;
  height: number;
}
export const VENUE_VIEW: MapBox = { x: -30, y: -20, width: 1060, height: 1060 };

/** One coordinate system for the overview, section focus and individual seats. */
export function layoutVenue(venue: DemoVenue) {
  return venue.sections.map((section, index) => {
    const upper = index < 2;
    const box = {
      x: upper
        ? 50 + index * (venue.arrangement === "tables" ? 620 : 470)
        : 50 + (index - 2) * 310,
      y: upper ? 150 : 580,
      width: upper && venue.arrangement !== "tables" ? 430 : 280,
      height: 360,
    };
    const seats = venue.seats.filter((seat) => seat.sectionId === section.id);
    const names = [...new Set(seats.map((seat) => seat.group))];
    const groups = names.map((name, groupIndex) => {
      const table = venue.arrangement === "tables";
      const x = table
        ? box.x + box.width * (groupIndex % 2 ? 0.72 : 0.28)
        : box.x + 18;
      const y =
        box.y +
        (table ? 70 + Math.floor(groupIndex / 2) * 62 : 62 + groupIndex * 29);
      return {
        name,
        x,
        y,
        seats: seats
          .filter((seat) => seat.group === name)
          .map((seat, i) => {
            const angle = (i * Math.PI) / 5 - Math.PI / 2;
            return {
              ...seat,
              x: table
                ? x + 23 * Math.cos(angle)
                : box.x + 43 + (i * (box.width - 65)) / 10,
              y: table ? y + 23 * Math.sin(angle) : y,
            };
          }),
      };
    });
    return { ...section, box, groups };
  });
}
export function focusBox(box: MapBox): MapBox {
  const size = Math.max(box.width, box.height) * 1.18;
  return {
    x: box.x + box.width / 2 - size / 2,
    y: box.y + box.height / 2 - size / 2,
    width: size,
    height: size,
  };
}
export function constrainCamera(box: MapBox): MapBox {
  const size = Math.min(1060, Math.max(140, box.width));
  return {
    x: Math.max(-100, Math.min(1100 - size, box.x)),
    y: Math.max(-100, Math.min(1100 - size, box.y)),
    width: size,
    height: size,
  };
}
