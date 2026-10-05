# Boleto clásico

Adaptación propia solicitada por el usuario, inspirada en el bloque instalado
Receipt Tiers (21st.dev; autor no identificado en el material aportado).
Conserva papel marfil, tipografía monoespaciada, líneas de puntos, sello y borde
dentado. No modifica el bloque de precios original.

Dos orientaciones con datos tipados y precio en centavos MXN. El horizontal se
apila cuando su contenedor tiene menos de 650 px. El talón se separa con botón
accesible y se puede volver a unir; no representa validación de acceso.
QR generado localmente con Ark UI, como en los boletos existentes: contiene solo
un identificador DEMO, sin datos personales ni servicios externos.
Sin nuevas dependencias. Respeta movimiento reducido.

Las versiones se presentan una debajo de otra. El formato horizontal distribuye
la información en columnas para formar una tira baja; la perforación es decorativa,
sin iconos ni texto. El control de demostración está fuera del boleto.

El componente y su CSS viven en `src/features/booking/components/receipt-ticket*`. El Playground reutiliza esa implementación; la compra confirmada ofrece sus orientaciones vertical y horizontal con datos de la orden.
