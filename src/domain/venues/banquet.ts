/** Plano entregado por el cliente: numeración y ubicación, sin marcas de venta del papel. */
export interface BanquetTable {
  label: string;
  x: number;
  y: number;
}
const column = (
  first: number,
  count: number,
  x: number,
  y: number,
): BanquetTable[] =>
  Array.from({ length: count }, (_, i) => ({
    label: String(first + i),
    x,
    y: y + i * 100,
  }));
export const BANQUET_SEATS_PER_TABLE = 10;
export const BANQUET_PLAN_SCALE = 0.88;
export const BANQUET_VIEW = {
  x: -30,
  y: -20,
  width: 1400 * BANQUET_PLAN_SCALE + 60,
  height: 1400 * BANQUET_PLAN_SCALE + 60,
};
// Leave circulation space at both walls and around the central dance floor.
export const BANQUET_SEAT_RING_RADIUS = 24;
export const BANQUET_TABLE_RADIUS = 15;
export const banquetTables: readonly BanquetTable[] = [
  ...column(1, 7, 1260, 350),
  ...column(8, 8, 1160, 300),
  ...column(16, 8, 1060, 350),
  ...column(24, 8, 960, 300),
  ...column(32, 2, 860, 900),
  ...column(34, 2, 540, 900),
  ...column(36, 8, 440, 300),
  ...column(44, 8, 340, 350),
  ...column(52, 7, 240, 300),
  { label: "A", x: 240, y: 1000 },
  ..."BCDEFGH"
    .split("")
    .map((label, i) => ({ label, x: 140, y: 350 + i * 100 })),
].map((table) => ({
  ...table,
  x: table.x * BANQUET_PLAN_SCALE,
  y: table.y * BANQUET_PLAN_SCALE,
}));
export const BANQUET_CAPACITY = banquetTables.length * BANQUET_SEATS_PER_TABLE;
export function banquetSeatIdentity(index: number) {
  const table = banquetTables[Math.floor(index / BANQUET_SEATS_PER_TABLE)];
  return {
    table: table?.label ?? "",
    number: (index % BANQUET_SEATS_PER_TABLE) + 1,
  };
}
