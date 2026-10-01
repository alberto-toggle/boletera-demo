# File Upload — Cover Upload

Autor: sean0205.
Origen: https://21st.dev/@sean0205/components/file-upload
Registro: https://21st.dev/r/sean0205/file-upload
Recuperado mediante MCP de 21st.dev, demo 4542.

Vista: /playground/21st-dev/file-upload. Categoría: Carga de archivos.

Integra la variante Cover Upload: portada 21:9, cambiar/eliminar, zona de
arrastre, progreso circular y recomendaciones. Conserva la imagen del autor.
La simulación es local y determinista; no hay subida real ni fallos aleatorios.

Adaptaciones: Button Base UI existente; error semántico local sin duplicar Alert;
hook acotado a una imagen con estados excluyentes; reglas de validación separadas;
acepta JPG/PNG/WebP hasta 5 MiB; conserva la selección ante archivos inválidos;
libera object URLs y cancela temporizadores al reemplazar, eliminar o desmontar.
Acciones visibles en táctil y teclado; next/image sin optimización remota.
No se importan utilidades ajenas a esta variante, primitivas Radix ni dependencias.

El registro no declara una licencia específica. Conservar la atribución y
verificar los términos del proveedor antes de redistribuir.
