# Boletos compartidos

`TicketDesignGallery` reúne Institucional, Gala, Editorial, Inmersivo y Clásico,
con orientación horizontal inicial para el clásico. Público y taquilla utilizan
la misma implementación. Recibe contratos mínimos de `model.ts`, sin sesión,
rutas, catálogo, persistencia ni lógica de cobro.

Cargar `design-gallery.css`; `receipt-ticket.module.css` se importa desde su
componente. La galería incluye sus tokens de color por diseño, con tipografías
Geist/Arial y Georgia. Requiere las primitivas de `components/ui`, Lucide,
Ark UI para QR y Framer Motion para animación. Las entradas antiguas de booking
e inmersiva reexportan estas piezas para compatibilidad. Se conserva la procedencia
de los bloques documentada en `features/booking/README.md` y
`features/immersive/README.md`. El clásico adapta Receipt Tiers del Playground.

`TicketDownloads` y `createTicketPdf` exportan el diseño renderizado: una página
por boleto, orientación adaptada al clásico horizontal, progreso y caché de PDF.
Dependencias: jsPDF, html-to-image y APIs del navegador. No generan ni confirman
ventas. La entrada antigua `booking/ticket-pdf.ts` reexporta el generador.

`AdmissionTicket` permanece como presentación independiente alternativa con su
propio `admission-ticket.css`; la confirmación de taquilla usa la galería compartida.
