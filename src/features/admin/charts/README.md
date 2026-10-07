# Visualizaciones administrativas

Componentes de presentación aislados del playground y de su catálogo. Los datos
se derivan en `overview/analytics-data.ts` de las ventas confirmadas y del rango
activo; fechas agrupadas en America/Mexico_City e importes en centavos MXN.

- `revenue-area`: adaptación de Area Charts 2 de sean0205. Áreas con degradado,
  tooltip y detalle tabular accesible; incluye días sin ventas como cero.
- `payment-bars`: patrón de barras redondeadas de Pace UI Dashboard Chart 5.
  Agrega importes por método, respetando ventas con pago dividido.
- `donut-chart`: extracción del Donut Chart de ravikatiyar162. Dos canales y
  etiquetas textuales de importes, porcentajes y boletos.
- `activity-skyline`: extracción de Contribution Skyline de kedhareswer. Canvas
  con transformación 2D/3D, navegación por teclado, órbita y movimiento reducido.
  Textos adaptados al español; recibe datos explícitos, nunca genera actividad
  ficticia adicional. Cuadrícula con periodo propio: 12 meses por defecto, 180 o 90 días. Incluye total, día más activo y rachas, tanto en 2D como en 3D.

`chart-tokens.ts` centraliza azul, violeta y cian para estadísticas. El panel
conserva su identidad de marca. Los vendedores pertenecen a fixtures de admin;
no se atribuyen ventas del flujo real de taquilla a esas personas.

Las extracciones conservan el origen y requieren revisar términos antes de
redistribuir: los registros de 21st no declararon licencia específica. No se
incorporan primitivas Radix ni nuevas dependencias.

Orígenes:
- https://21st.dev/r/sean0205/area-charts-2
- https://paceui.com (registro @paceui/dashboard-chart-5)
- https://21st.dev/r/ravikatiyar162/donut-chart
- https://21st.dev/r/kedhareswer/contribution-skyline

Records Table de theshanelevine permanece como bloque de evaluación en el
playground. En la tabla de eventos se adaptaron encabezados ordenables y subtotal
calculado para las filas visibles; sus campos de CRM no se trasladaron al panel.
