# Great UI Revision Timeline

Autor: Saurabh Sharma (saurabh-2607 / Great UI).
Origen: https://21st.dev/@saurabh-2607/components/great-ui-revision-timeline
Registro: https://21st.dev/r/saurabh-2607/great-ui-revision-timeline
Recuperado mediante MCP de 21st.dev, demo 23363.
El código original declara licencia MIT y conserva su atribución al final.

Vista: /playground/21st-dev/great-ui-revision-timeline.
Categoría: Líneas de tiempo.

Conserva el dial animado, contenido Markdown simplificado y tres revisiones
ilustrativas del autor. Datos separados de presentación.
Adaptaciones: movimiento reducido, next/image sin optimización, contenido
enfocable, etiquetas de navegación, limpieza de efectos y fechas en UTC.
El relleno temporal se calcula desde las revisiones en lugar de meses fijos.
defaultActiveId establece la selección inicial; activeId permite control externo.
La navegación usa el número de días únicos. No agrega dependencias ni
sobrescribe primitivas.
