export const defaultCover = {
  name: "cover-image.jpg",
  url: "https://cdn.21st.dev/assets/mirror/87/8771b89c89c46db43aea4a969139b4a1909966edefbf9fd5171e114e1934932e.jpg",
};
export const maxCoverSize = 5 * 1024 * 1024;
export const coverMimeTypes = ["image/jpeg", "image/png", "image/webp"] as const;

export function validateCover(file: Pick<File, "size" | "type">): string | null {
  if (!coverMimeTypes.some((type) => type === file.type)) return "Selecciona una imagen JPG, PNG o WebP.";
  if (file.size > maxCoverSize) return "La imagen supera el límite de 5 MB.";
  if (file.size === 0) return "El archivo está vacío.";
  return null;
}
