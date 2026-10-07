import {
  IMAGE_TYPES,
  MAX_IMAGE_BYTES,
  MAX_STORED_IMAGE_LENGTH,
  type EventImage,
} from "./model";
// Local demo adapter. Replace this function with a real upload service later;
// the gallery receives processed images and never knows the storage mechanism.
export async function prepareEventImage(file: File): Promise<EventImage> {
  if (!IMAGE_TYPES.some((type) => type === file.type))
    throw new Error("Usa imágenes JPG, PNG o WebP.");
  if (!file.size) throw new Error("El archivo está vacío.");
  if (file.size > MAX_IMAGE_BYTES)
    throw new Error("La imagen supera los 5 MB.");
  const bitmap = await createImageBitmap(file).catch(() => {
    throw new Error("No pudimos leer esta imagen. Prueba con otro archivo.");
  });
  try {
    const scale = Math.min(1, 1600 / Math.max(bitmap.width, bitmap.height));
    const canvas = document.createElement("canvas");
    canvas.width = Math.max(1, Math.round(bitmap.width * scale));
    canvas.height = Math.max(1, Math.round(bitmap.height * scale));
    const context = canvas.getContext("2d");
    if (!context)
      throw new Error("No pudimos preparar la imagen en este navegador.");
    context.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
    let src = canvas.toDataURL("image/webp", 0.82);
    for (const quality of [0.72, 0.6, 0.48]) {
      if (src.length <= MAX_STORED_IMAGE_LENGTH) break;
      src = canvas.toDataURL("image/webp", quality);
    }
    if (
      src.length > MAX_STORED_IMAGE_LENGTH ||
      !src.startsWith("data:image/webp;")
    )
      throw new Error(
        "Esta imagen tiene demasiado detalle. Prueba con una versión más pequeña.",
      );
    return {
      id: crypto.randomUUID(),
      name: file.name.slice(0, 200),
      src,
      width: canvas.width,
      height: canvas.height,
    };
  } finally {
    bitmap.close();
  }
}
