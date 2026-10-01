# QR Code Generator

Autor: user_xn1cklas.
Origen: https://21st.dev/@user_xn1cklas/components/qr-code-generator
Registro: https://21st.dev/r/user_xn1cklas/qr-code-generator
Recuperado mediante MCP de 21st.dev, demo 6838.

Vista: /playground/21st-dev/qr-code-generator. Categoría: Códigos QR.

El componente original es un visor con descarga PNG. Su demo dibuja un patrón
decorativo en canvas, no genera códigos QR válidos. Se conserva el patrón y se
explica esta limitación en la vista, sin atribuirle funciones de emisión de boletos.

Adaptaciones: reutiliza Card y Button Base UI existentes, next/image sin
optimización, demo con estados tipados y auxiliar separado, cancelación de
requestAnimationFrame, petición y temporizador al desmontar. Los errores de
descarga permiten reintentar. No instala Radix ni otras dependencias.

El registro no declara una licencia específica. Conservar la atribución y
verificar los términos del proveedor antes de redistribuir.
