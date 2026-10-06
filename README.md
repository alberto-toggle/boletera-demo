This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Alcance actual

Este proyecto servirá para construir una demo para un cliente potencial, con
datos hardcodeados y flujos simulados. Los documentos de requerimientos son
contexto del posible producto. Actualmente hay cuatro propuestas de página de inicio
con un catálogo ficticio compartido; las cuatro conectan con selección de lugares, checkout simulado y boletos imprimibles.

## Tres propuestas de inicio

La ruta `/` permite compararlas y abrir el playground:

| Ruta | Dirección |
| --- | --- |
| `/demo-institucional` | Institucional: verde profundo, portada dividida y tarjetas de eventos |
| `/demo-gala` | Gala: fotografía inmersiva, atmósfera nocturna y motivo de boleto |
| `/demo-editorial` | Editorial: composición gráfica, acentos rojos y agenda en lista |
| `/demo-inmersiva` | Menú flotante, hero expansivo y boleto con talón |

Boletera es una marca provisional. Las cuatro propuestas comparten nueve eventos
ficticios y contemplan compra como invitado y usuarios con cuenta; incluyen checkout de prueba como invitado o con cuenta ficticia, sin autenticación ni venta real.

La [documentación de event-discovery](src/features/event-discovery/README.md)
detalla rutas, responsabilidades, datos, comportamiento, código reutilizado,
referencias visuales y verificaciones realizadas. El [flujo de compra](src/features/booking/README.md) detalla los bloques adaptados del playground y las reglas simuladas. El
[inventario de fotografías](public/images/events/README.md) registra sus fuentes.

## Playground de componentes

La deuda pendiente para reutilizar los componentes públicos en operación u otros
repositorios está registrada en [DT-001 · Separación y portabilidad de los componentes públicos](docs/deuda-tecnica/separacion-publico-operacion.md).

### Base visual

shadcn está inicializado con Base UI, preset Nova, color Neutral e iconos Lucide.
Tailwind CSS v4 está integrado mediante `@tailwindcss/postcss`.
La configuración de aliases está en `components.json`; las primitivas compartidas
se agregan en `src/components/ui` y la utilidad `cn` está en `src/lib/utils.ts`.
El tema oscuro se activa mediante la clase `dark` en el elemento raíz.

Antes de incorporar un bloque externo, revisar `shadcn add <origen> --dry-run`
y `--diff`. Evitar `--overwrite`; reutilizar las primitivas compatibles y
mantener las variantes incompatibles dentro de `src/components/blocks/<proveedor>/<bloque>`.
Revisar también dependencias y cambios al CSS global. Para registros que cambien
archivos compartidos, realizar la instalación en una copia temporal y trasladar
solo lo necesario. Registrar el origen y las adaptaciones junto al bloque.

### Vistas de prueba

La ruta `/playground` es el índice de los bloques y componentes en evaluación.
Incluye siete bloques de shadcn.io:

- `Product Card Event`: `/playground/shadcn-io/product-card-event`.
- `Product Card Virtual Event`: `/playground/shadcn-io/product-card-virtual-event`.
- `Music Concert Tickets`: `/playground/shadcn-io/music-concert-tickets`.
- `Checkout Event Tickets`: `/playground/shadcn-io/checkout-event-tickets`.
- `Footer Event`: `/playground/shadcn-io/footer-event`.
- `Music Concert Countdown`: `/playground/shadcn-io/music-concert-countdown`.
- `Calendar Event Details`: `/playground/shadcn-io/calendar-event-details`.

También incluye `Credit Card` de Kibo UI en `/playground/kibo-ui/credit-card`,
con sus componentes separados en `src/components/blocks/kibo-ui/credit-card`.

`Glass Order Summary` de UI TripleD está en
`/playground/uitripled/glass-order-summary-shadcnui`, con su código en
`src/components/blocks/uitripled/glass-order-summary-shadcnui`.

`Glass Checkout Card` del mismo proveedor está en
`/playground/uitripled/glass-checkout-card-shadcnui`, siguiendo la misma estructura.

Para incorporar un bloque o grupo de componentes:

1. Crear su vista en `src/app/playground/<proveedor>/<bloque>/page.tsx`.
2. Agregar el bloque en `src/lib/playground.ts`; el índice y la barra lateral
   mostrarán su enlace automáticamente.
3. Instalar el código del componente en
   `src/components/blocks/<proveedor>/<bloque>/<bloque>.tsx`, con su `README.md`
   de origen y adaptaciones. Los archivos auxiliares quedan en esa misma carpeta.
4. Mantener las composiciones y datos exclusivos de la vista dentro de la
   carpeta de la vista. Las primitivas compartidas permanecen en `src/components/ui`.

Esta convención se aplica a todos los proveedores, aunque el registro original
proponga otra ubicación. Los identificadores actuales son `shadcn-io`, `kibo-ui`, `uitripled`, `21st-dev` y `shadcn-ui-blocks`.

```text
src/app/playground/
  shadcn-io/<bloque>/page.tsx
  kibo-ui/credit-card/page.tsx
src/components/
  blocks/
    shadcn-io/<bloque>/<bloque>.tsx
    kibo-ui/credit-card/credit-card.tsx
  ui/
```

Las URLs antiguas con el proveedor como prefijo redirigen a las nuevas rutas
anidadas mediante `next.config.ts`.

El layout de `/playground` usa el bloque Navbar Sidebar Toggle de shadcn.io
como navegación compartida. Incluye barra lateral contraíble en escritorio y
menú desplegable en móvil. Cada vista conserva su propia composición interna.

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

Admit One Ticket de larsen66 (21st.dev): `/playground/21st-dev/admit-one-ticket`. Código y auxiliares en `src/components/blocks/21st-dev/admit-one-ticket`.

Event Registration Countdown: `/playground/shadcn-ui-blocks/marketing-hero-forms-event-registration-countdown`.
