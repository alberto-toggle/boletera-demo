# Propuestas de inicio de Boletera

Cuatro alternativas de página de inicio para comparar direcciones visuales de una
boletera. **Boletera es un nombre provisional**, no una identidad oficial del cliente.
Las cuatro usan el mismo catálogo ficticio de nueve eventos de 2027.

## Rutas y direcciones

| Ruta                  | Composición                                                           | Archivo de vista                                       |
| --------------------- | --------------------------------------------------------------------- | ------------------------------------------------------ |
| `/`                   | Índice de comparación y acceso al playground                          | [page.tsx](../../app/page.tsx)                         |
| `/demo-institucional` | Portada dividida, verde profundo, agenda en tarjetas                  | [institutional-home.tsx](views/institutional-home.tsx) |
| `/demo-gala`          | Fotografía inmersiva, tonos nocturnos, galería y motivo de boleto     | [gala-home.tsx](views/gala-home.tsx)                   |
| `/demo-editorial`     | Titulares gráficos, acento rojo, portada asimétrica y agenda en lista | [editorial-home.tsx](views/editorial-home.tsx)         |

Las páginas viven en `src/app/(demos)/`. Los paréntesis definen un grupo de rutas;
no agregan un segmento a las URLs. Su [layout](<../../app/(demos)/layout.tsx>)
importa los estilos de esta funcionalidad. `/playground` conserva su navegación
y sus rutas por proveedor. Ninguna propuesta ha sido seleccionada como definitiva.

## Organización y responsabilidades

```text
src/features/event-discovery/
  model.ts                  Contratos, categorías, búsqueda y formatos
  fixtures.ts               Catálogo e información ficticia de eventos
  discovery.css             Temas, composiciones y estilos responsive
  components/
    agenda.tsx              Filtros, búsqueda y expansión del catálogo
    event-card.tsx          Presentación de un evento en tarjeta
    event-preview.tsx       Vista previa y aviso informativo de cuenta
    mobile-menu.tsx         Menú móvil y cierre por enlace/Escape/exterior
    chrome.tsx              Marca, cabecera, ayuda, pie y selector de propuestas
  views/
    institutional-home.tsx  Composición institucional
    gala-home.tsx           Composición gala
    editorial-home.tsx      Composición editorial
```

Las rutas componen las vistas; las vistas reciben el catálogo de `fixtures.ts` y
lo pasan a los componentes. `Agenda` recibe `readonly DiscoveryEvent[]`, y tanto
`EventCard` como `EventPreview` reciben un evento por props. No realizan consultas
remotas ni conocen una API de venta.

Las vistas y `chrome.tsx` son Server Components. Las interacciones están en
`Agenda`, `EventPreview`/`AccountPreview` y `MobileMenu`, declarados con
`"use client"`. `EventCard` también entra en el árbol cliente cuando lo importa
`Agenda`. No hay dependencia de rutas ni bloques del playground.

`discovery.css` delimita los temas bajo `.discovery` y sus variantes
`.institutional`, `.gala` y `.editorial`; `.proposal-hub` estiliza el índice.
Las variables locales permiten reutilizar el botón compartido sin cambiar el
tema global del playground. La regla sobre `html:has(.discovery .event-modal[open])`
bloquea el desplazamiento del fondo solo mientras hay una vista previa abierta.

## Datos y comportamiento

- `DiscoveryEvent` define identificación, categoría, fecha, sede, precio, imagen,
  descripción e inclusiones. Las tres categorías son Celebraciones, Ceremonias y
  Encuentros. Los nombres, sedes, fechas, precios e inclusiones son ilustrativos.
- El dinero se almacena como enteros en centavos (`amountMinor`) con moneda
  explícita `MXN`. El formato actual muestra pesos sin decimales; todos los
  precios de las fixtures son cantidades de pesos completas.
- Las fechas incluyen desplazamiento horario y se presentan con locale `es-MX`
  y zona `America/Mexico_City`, independientemente de la zona del dispositivo.
- Las agendas en tarjetas usan un carrusel con todos los resultados (nueve sin
  filtrar); las flechas, el gesto horizontal y el teclado permiten recorrerlos.
  La agenda secundaria en lista de Gala conserva expansión de tres a nueve.
  El filtro de categoría y la búsqueda se combinan; la búsqueda compara
  título, sede y categoría, ignorando mayúsculas, acentos y espacios exteriores.
- La búsqueda sin resultados ofrece restablecer categoría y texto. La expansión
  previa se conserva mientras se filtra; no se persiste entre recargas.
- Las vistas previas usan el elemento nativo `dialog`: cierre con botón, Escape
  o clic fuera; retorno del foco al disparador. No reservan lugares.
- El menú móvil usa `details`, cierra al seleccionar un enlace, tocar fuera o
  pulsar Escape; Escape devuelve el foco al control del menú. Las preguntas
  frecuentes también usan `details` y pueden abrirse independientemente.
- El selector inferior enlaza las propuestas. `Mi cuenta` muestra un aviso del
  alcance futuro: se contempla tanto compra como invitado como usuarios con cuenta.

**Alcance actual:** estas portadas conectan con un recorrido de compra simulado:
mapa, selección de lugares, datos del comprador, pago de prueba y boletos
individuales imprimibles. Ver [compra de demostración](../booking/README.md) para
las reglas, bloques adaptados y límites. No hay pagos, correos ni acceso reales.

## Procedencia del código y referencias

La implementación de las portadas es propia de la demo. El flujo de compra añadido
sí adapta código de tres bloques, documentados en el README de booking. No se trasladó código
fuente de los bloques del playground a esta funcionalidad ni se los importa.
El catálogo se utilizó como referencia visual; esto no equivale a que las páginas
estén ensambladas con todos los bloques previamente instalados.

### Piezas reutilizadas directamente

| Pieza                                    | Procedencia y uso                                                                                                                    |
| ---------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------ |
| [Button](../../components/ui/button.tsx) | Primitiva existente de shadcn sobre Base UI, estilo `base-nova`; filtros auxiliares, vistas previas y controles. No se sobrescribió. |
| `next/image`, `next/link`                | Dependencias existentes de Next.js para imágenes y navegación.                                                                       |
| `lucide-react`                           | Iconos de la dependencia existente, incluido el asterisco de la marca provisional.                                                   |
| Geist y Georgia                          | Geist se configura en el layout raíz existente; Georgia es una fuente del sistema para los titulares serif.                          |

### Inspiración del catálogo revisado

| Referencia                                   | Relación con las propuestas                                                                                          | Registro de origen existente                                                         |
| -------------------------------------------- | -------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------ |
| Product Card Event · shadcn.io               | Jerarquía de imagen, datos del evento y precio de entrada                                                            | [README del bloque](../../components/blocks/shadcn-io/product-card-event/README.md)  |
| Condition Grid · uilayout.contact / 21st.dev | Composición de imágenes con diferentes proporciones; portada editorial                                               | [README del bloque](../../components/blocks/21st-dev/conditiongrid/README.md)        |
| Interactive Selector · minhxthanh / 21st.dev | Selección de experiencias mediante paneles fotográficos; galería de gala. La demo no copia su expansión interactiva. | [README del bloque](../../components/blocks/21st-dev/interactive-selector/README.md) |
| Ticket Stub Footer · kedhareswer / 21st.dev  | Motivo de boleto y separación de talón en la propuesta gala; sin su animación ni canvas                              | [README del bloque](../../components/blocks/21st-dev/ticket-stub-footer/README.md)   |
| Navbar2 · anelkabag / 21st.dev               | Referencia de navegación del catálogo. La cabecera de la demo usa enlaces y un menú móvil propios.                   | [README del bloque](../../components/blocks/21st-dev/navbar2/README.md)              |

Los README de esos bloques conservan sus fuentes y notas de licencia. Su presencia
en el catálogo no convierte todo su código en parte de las propuestas.

Cineteca Nacional, Ticketmaster México y Boletia fueron referencias de estructura
comentadas durante la exploración del producto. No se copiaron sus marcas, textos,
imágenes ni código en estas páginas.

Las fotografías locales y sus URLs de origen se documentan en
[public/images/events/README.md](../../../public/images/events/README.md).

## Cómo continuar

Para cambiar el catálogo, editar `fixtures.ts` y conservar el contrato de
`model.ts`. Para cambiar una composición, editar únicamente su vista y sus
selectores de tema. Cambiar `components/` cuando el comportamiento deba ser común
entre las cuatro propuestas. El catálogo común facilita compararlas con los mismos datos.

Al incorporar datos reales, validar la respuesta externa antes de entregarla a
los componentes. La selección y compra están separadas en `../booking/`; no convertir sus avisos
de demo en confirmaciones de operaciones reales.
Las directrices generales están en [AGENTS.md](../../../AGENTS.md).

## Verificación realizada y límites

- Revisión visual en Chrome sobre el servidor existente del puerto 3000 a anchos
  de 1440, 768, 390 y 320 px. Se corrigieron recortes de títulos y del boleto,
  distribución editorial, fechas, alineación de precios y contraste en gala.
- 51 comprobaciones automatizadas de interacción en Chrome, entre las tres
  rutas a 1440 y 390 px: expansión, categorías, búsqueda combinada, estado vacío,
  modales, foco, Escape, cierre exterior, aviso de cuenta, preguntas frecuentes,
  menú móvil y navegación entre propuestas. Resultado final: sin fallos ni errores
  de página en esa ejecución.
- Comprobaciones adicionales de enlaces del menú, teclado, cierre exterior,
  vistas previas destacadas y bloqueo/restauración del desplazamiento del fondo.
- `npm run lint` y `npx tsc --noEmit` pasaron después de los ajustes de interacción.

Las pruebas de navegador se ejecutaron mediante scripts temporales fuera del
repositorio; **no existe todavía una suite E2E instalada ni un comando de regresión
del proyecto**. Este registro describe comprobaciones efectuadas, no una garantía
de cobertura continua. No se probó Safari, Firefox ni un dispositivo físico.
El servidor lo inició el usuario; los agentes no deben iniciar otro sin autorización.

## Cuarta propuesta y movimiento

La propuesta `/demo-inmersiva` vive en `features/immersive`; su README documenta
las adaptaciones de Navbar2, Scroll Expansion Hero y Admit One Ticket.
Las cuatro rutas comparten entradas suaves al viewport, respuestas de hover y
zonas clicables que cubren las tarjetas completas. Se conserva el botón semántico
para teclado y se respeta movimiento reducido. Las comprobaciones anteriores
corresponden a las tres propuestas originales.


`event-carousel.tsx` adapta el patrón de desplazamiento y ResizeObserver de
Filmstrip Gallery ya instalado, reutiliza EventCard/EventPreview y mantiene la
identidad de cada propuesta. Gala conserva la tarjeta fotográfica; Inmersiva
mantiene los destinos por categoría del mega menú. Al filtrar se reinicia la
posición del carrusel. No hay autoplay.

Carruseles verificados en las cuatro propuestas: nueve eventos alcanzables,
apertura del último evento, flechas y ausencia de desbordamiento de página a
320 px. Las listas secundarias y el archivo de eventos anteriores se conservan.

## Catálogo único entre propuestas

Las cuatro agendas consumen `demoEvents` en el mismo orden cronológico de
`fixtures.ts`. Los cuatro heroes y el menú destacado usan la imagen, texto
alternativo y evento de `featuredEvent`, también incluido en esa colección.
No asignar imágenes alternativas a los heroes por propuesta. La presentación
y el encuadre responsive pueden variar; el evento y su fotografía son los mismos.
