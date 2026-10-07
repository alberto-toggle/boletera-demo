<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

## Calidad y objetivo de la demo

- La demo usa datos ficticios y simula operaciones, pero sus piezas deben poder
  reutilizarse en la aplicación real. Aplicar el mismo criterio de tipado,
  claridad, accesibilidad y separación de responsabilidades que en producción.
- Los documentos funcionales son referencias de producto. Las aclaraciones
  explícitas del usuario tienen prioridad; no convertir ejemplos, supuestos o
  propuestas visuales en requisitos confirmados.
- Trabajar dentro del alcance pedido. No implementar backend, autenticación,
  cobros reales ni publicación externa como consecuencia de una simulación.
- Antes de comprobar la UI local, preguntar al usuario en qué puerto está corriendo
  esta aplicación; no asumir el puerto 3000 ni reutilizar el de otra sesión.
- No iniciar `next dev`, `next start` ni otros servidores sin autorización
  explícita del usuario. Respetar su instrucción de no ejecutar comandos sin
  autorización; limitar los comandos al trabajo autorizado.

## TypeScript y modelado

- Mantener `strict: true`. Escribir el código nuevo de la aplicación en
  TypeScript y tipar props, datos de ejemplo, resultados y estados del flujo.
- Evitar `any`, `@ts-nocheck`, `@ts-ignore`, aserciones no justificadas y
  operadores de no nulidad para ocultar errores. Usar `unknown` y validación
  cuando se desconozca la forma de un dato externo.
- Modelar estados excluyentes con uniones discriminadas cuando corresponda;
  evitar combinaciones de booleanos que permitan estados imposibles.
- Representar dinero en unidades menores enteras con moneda explícita y
  formatearlo para la interfaz. Hacer explícitas las convenciones de fecha y
  zona horaria; no depender accidentalmente de la zona horaria del dispositivo.
- Validar entradas en los límites del sistema. Los tipos estáticos no validan
  formularios, parámetros de URL, almacenamiento del navegador ni respuestas
  externas en tiempo de ejecución.

## Separación de responsabilidades y simulaciones

- Mantener las rutas y layouts centrados en composición y navegación.
  Separar presentación, reglas de negocio y acceso a datos.
- Organizar las funcionalidades por dominio cuando crezcan, por ejemplo en
  `src/features/<funcionalidad>/`. Mantener tipos, lógica, componentes específicos
  y datos de ejemplo cerca de la funcionalidad que los usa. Extraer a carpetas
  compartidas solo lo que tenga uso compartido real.
- Los componentes visuales reciben datos y callbacks tipados; no deben conocer
  la fuente de datos ni contener catálogos de eventos o lógica de cobro.
- Centralizar los datos ficticios en fixtures tipadas y las operaciones simuladas
  en módulos explícitos de demo. Exponer contratos pequeños que permitan cambiar
  esas implementaciones por servicios reales sin reescribir la presentación.
- Mantener una única fuente de verdad para selección, importes y estados.
  Calcular datos derivados en lugar de duplicarlos en varios estados locales.
- Aislar temporizadores, persistencia local y efectos del navegador; limpiar los
  efectos y permitir reiniciar el flujo de demo de forma predecible.
- Mantener separadas compra, boleto y acceso: una compra puede incluir varios
  boletos y una venta confirmada no equivale a asistencia registrada.
- Simular estados de éxito y los fallos relevantes para el flujo mostrado, sin
  presentar pagos, correos, reservas o autenticación simulados como reales.
- No crear capas, repositorios genéricos o abstracciones especulativas. Preferir
  funciones pequeñas, nombres claros y contratos ajustados al caso de uso.

## Componentes, interfaz y verificación

- El playground es un espacio de evaluación. Al reutilizar un bloque en la demo,
  revisar su código y extraer o adaptar la pieza a su ubicación definitiva;
  evitar dependencias de la aplicación respecto a rutas o scaffolding del playground.
- Reutilizar las primitivas y tokens del proyecto. Conservar la procedencia de
  los bloques y respetar sus licencias; el código externo requiere el mismo
  criterio de calidad que el código propio antes de incorporarlo a la demo.
- Usar Server Components por defecto y limitar `use client` a los límites que
  necesitan interacción o APIs del navegador, siguiendo la documentación local
  de la versión instalada de Next.js.
- Implementar HTML semántico, etiquetas de formulario, navegación por teclado,
  foco visible, estados de error comprensibles y comportamiento responsive.
  Respetar preferencias de movimiento reducido cuando haya animaciones.
- Verificar los cambios de código con lint y comprobación de tipos dentro del
  trabajo autorizado. Por indicación del usuario, no añadir pruebas unitarias
  durante esta etapa de demo; mantener lint, tipos y revisión de los flujos
  en navegador. Retomar pruebas unitarias solo cuando el usuario lo solicite.
- Revisar interacciones y presentación cuando haya un entorno disponible y
  autorizado. Informar qué se verificó y qué quedó sin verificar; no afirmar
  validación visual o funcional basándose solo en compilación.

## Organización del playground

- Usar un único patrón para todos los proveedores: vistas en
  `src/app/playground/<proveedor>/<bloque>/page.tsx` y código importado en
  `src/components/blocks/<proveedor>/<bloque>/<bloque>.tsx`.
- Proveedores actuales: `shadcn-io`, `kibo-ui`, `uitripled`, `21st-dev`, `shadcn-ui-blocks` y `paceui`. Adaptar los destinos del registro
  a esta estructura; no crear carpetas alternativas por proveedor.
- Mantener auxiliares y README de origen junto al bloque. Primitivas compartidas
  en `src/components/ui`; no sobrescribirlas al instalar bloques externos.
- Registrar cada vista en `src/lib/playground.ts`, usando la URL anidada para
  que el índice y la navegación compartan el mismo catálogo.
- Agrupar el árbol de navegación por tipo de componente (`category`), nunca por
  proveedor. Ordenar categorías y bloques alfabéticamente. Mantener el origen
  (`provider`) visible en las vistas de los bloques y conservar las rutas por proveedor.

## Base de componentes

- shadcn usa Base UI con estilo `base-nova`. Mantener esta base al agregar primitivas.
- Revisar bloques externos por APIs y selectores de Radix antes de integrarlos:
  usar `render` en lugar de `asChild` cuando corresponda y `data-checked` para radios.
- No reintroducir `radix-ui` ni sustituir primitivas compartidas por variantes Radix.
