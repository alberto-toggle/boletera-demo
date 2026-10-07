export interface EventImage {
  id: string;
  src: string;
  name: string;
  width: number;
  height: number;
}
export interface EventMedia {
  image: string;
  images: EventImage[];
}
export const MAX_EVENT_IMAGES = 6;
export const MAX_IMAGE_BYTES = 5 * 1024 * 1024;
export const MAX_STORED_IMAGE_LENGTH = 300_000;
export const IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"] as const;
export function isImageSource(value: unknown): value is string {
  return (
    typeof value === "string" &&
    (/^\/images\/events\/[a-zA-Z0-9_-]+\.(jpg|jpeg|png|webp)$/.test(value) ||
      (value.length <= MAX_STORED_IMAGE_LENGTH &&
        /^data:image\/webp;base64,[A-Za-z0-9+/]+={0,2}$/.test(value)))
  );
}
export function isEventImage(value: unknown): value is EventImage {
  if (!value || typeof value !== "object") return false;
  const image = value as Record<string, unknown>;
  return (
    typeof image.id === "string" &&
    /^[a-zA-Z0-9-]+$/.test(image.id) &&
    typeof image.name === "string" &&
    image.name.length > 0 &&
    image.name.length <= 200 &&
    isImageSource(image.src) &&
    typeof image.width === "number" &&
    Number.isInteger(image.width) &&
    image.width > 0 &&
    image.width <=
      (typeof image.src === "string" && image.src.startsWith("/images/events/")
        ? 10000
        : 1600) &&
    typeof image.height === "number" &&
    Number.isInteger(image.height) &&
    image.height > 0 &&
    image.height <=
      (typeof image.src === "string" && image.src.startsWith("/images/events/")
        ? 10000
        : 1600)
  );
}
export function isImageCollection(value: unknown): value is EventImage[] {
  return (
    Array.isArray(value) &&
    value.length <= MAX_EVENT_IMAGES &&
    value.every(isEventImage) &&
    new Set(value.map((image) => image.id)).size === value.length
  );
}
export function reorderImage(
  images: readonly EventImage[],
  id: string,
  direction: -1 | 1,
): EventImage[] {
  const from = images.findIndex((image) => image.id === id);
  const to = from + direction;
  if (from < 0 || to < 0 || to >= images.length) return [...images];
  const result = [...images];
  [result[from], result[to]] = [result[to], result[from]];
  return result;
}
