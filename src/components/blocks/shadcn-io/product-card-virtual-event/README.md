# Product Card Virtual Event

Origen: https://www.shadcn.io/blocks/product-card-virtual-event
Registro: https://www.shadcn.io/r/product-card-virtual-event.json (requiere acceso autorizado).
Proveedor: shadcn.io. Importado el 30 de septiembre de 2026.

Vista: `/playground/shadcn-io/product-card-virtual-event`.

Adaptaciones:

- Imports `~/` convertidos a `@/` y ubicación separada por proveedor.
- Reutiliza Badge, Button, Card, Label y RadioGroup existentes sin sobrescribirlos.
- Añade Avatar y Separator oficiales con el preset Base UI Nova del proyecto.
- Nombre descriptivo del componente, IDs únicos para opciones, nombre accesible
  del grupo y texto alternativo en avatares.
- Next Image sin optimización para la portada externa; las imágenes originales
  de Unsplash requieren conexión a internet.
- Espaciado de Card ajustado localmente y encabezado subordinado al de la página.
- Datos originales en inglés; formato numérico explícito para evitar diferencias
  entre servidor y navegador.
- Selección de entrada y precio conservan el comportamiento original. Registro
  y calendario deshabilitados con una nota de vista previa, pues el bloque
  original no implementa esas acciones. La zona horaria es texto estático.

No se guardan credenciales ni tokens de descarga en el repositorio.
