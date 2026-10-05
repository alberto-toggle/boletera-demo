import { jsPDF } from "jspdf";
import { getFontEmbedCSS, toCanvas } from "html-to-image";

/** Capture the actual themed components, with a complete ticket on each page. */
export async function createTicketPdf(elements: readonly HTMLElement[]) {
  if (!elements.length) throw new Error("No hay boletos para exportar");
  await document.fonts.ready;
  // Let React apply the export state, which removes transient hover/motion styles.
  await new Promise<void>((resolve) => requestAnimationFrame(() => resolve()));
  const pdf = new jsPDF({ unit: "mm", format: "a4", compress: true });
  const fontEmbedCSS = await getFontEmbedCSS(elements[0]);
  for (const [index, source] of elements.entries()) {
    // A small screen stacks the classic for readability; export its chosen
    // horizontal format on an offscreen layout without moving the visible UI.
    let exportLayout: HTMLElement | undefined;
    let element = source;
    const classic = source.closest<HTMLElement>(
      '.classic-ticket-preview[data-orientation="horizontal"]',
    );
    if (classic && classic.clientWidth < 650) {
      exportLayout = classic.cloneNode(true) as HTMLElement;
      Object.assign(exportLayout.style, {
        position: "fixed",
        left: "-10000px",
        top: "0",
        width: "960px",
        pointerEvents: "none",
      });
      exportLayout.setAttribute("aria-hidden", "true");
      classic.parentElement?.appendChild(exportLayout);
      element =
        exportLayout.querySelector<HTMLElement>("[data-pdf-ticket]") ?? source;
    }
    try {
      const { width, height } = element.getBoundingClientRect();
      if (!width || !height) throw new Error("El boleto no está visible");
      const backgroundColor =
        getComputedStyle(element).getPropertyValue("--paper").trim() ||
        "#ffffff";
      const canvas = await toCanvas(element, {
        pixelRatio: 3,
        fontEmbedCSS,
        backgroundColor,
        style: { margin: "0", transform: "none" },
      });
      // Preserve the displayed proportions, including the classic's orientation.
      const pageWidth = width > height ? 297 : 210;
      const pageHeight = width > height ? 210 : 297;
      const orientation = width > height ? "landscape" : "portrait";
      if (index === 0) {
        pdf.deletePage(1);
      }
      pdf.addPage([pageWidth, pageHeight], orientation);
      const scale = Math.min(
        (pageWidth - 24) / width,
        (pageHeight - 24) / height,
      );
      const drawWidth = width * scale;
      const drawHeight = height * scale;
      pdf.addImage(
        canvas,
        "PNG",
        (pageWidth - drawWidth) / 2,
        (pageHeight - drawHeight) / 2,
        drawWidth,
        drawHeight,
      );
      canvas.width = 0;
      canvas.height = 0;
    } finally {
      exportLayout?.remove();
    }
  }
  pdf.setProperties({
    title: "Tus boletos · Boletera",
    subject: "Boletos de demostración · Sin validez de acceso",
  });
  return pdf;
}
