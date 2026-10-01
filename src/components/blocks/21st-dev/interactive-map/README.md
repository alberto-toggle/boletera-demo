# Interactive Map

Autor: lovesickfromthe6ix.
Origen: https://21st.dev/@lovesickfromthe6ix/components/interactive-map
Registro: https://21st.dev/r/lovesickfromthe6ix/interactive-map
Recuperado mediante MCP de 21st.dev, demo 3898.

Vista: /playground/21st-dev/interactive-map. Categoría: Mapas.

Conserva Leaflet, las coordenadas e imagen del ejemplo de Londres, marcadores
agrupados, polígonos, círculos, búsqueda, capa satelital y selección de coordenadas.
Los polígonos del autor son ilustrativos, no límites geográficos oficiales.

Adaptaciones: carga dinámica sin SSR; tipos y fixtures separados; controles
React con etiquetas y estados de error; validación y cancelación de búsqueda;
solicitudes manuales separadas al menos 1.1 segundos; geolocalización solo bajo
acción del usuario; capas mutuamente excluyentes; limpieza de observadores;
movimiento reducido y zoom de rueda deshabilitado para no capturar el scroll.
Se omiten controles de tráfico/dibujo que el original declaraba sin implementar.
No se modifica globalmente el icono de Leaflet ni primitivas compartidas.

Dependencias: leaflet, react-leaflet, react-leaflet-cluster y @types/leaflet.
Los servicios externos requieren conexión; sin claves en esta demo.
Antes de producción, revisar las políticas y capacidad del proveedor de mapas
y geocodificación.

El registro no declara una licencia específica. Conservar la atribución y
verificar los términos del proveedor antes de redistribuir.
