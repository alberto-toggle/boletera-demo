import {
  banquetTables,
  BANQUET_PLAN_SCALE as S,
  type BanquetTable,
} from "./banquet";

export interface BanquetConfiguration {
  nextNumber: number;
  extras: BanquetTable[];
}
export const emptyBanquetConfiguration: BanquetConfiguration = {
  nextNumber: 59,
  extras: [],
};
export function configuredTables(config?: BanquetConfiguration) {
  return [...banquetTables, ...(config?.extras ?? [])];
}
export function banquetBounds(config?: BanquetConfiguration) {
  const tables = configuredTables(config);
  const left = Math.min(25, ...tables.map((t) => t.x / S - 100));
  const right = Math.max(1375, ...tables.map((t) => t.x / S + 100));
  const bottom = Math.max(1240, ...tables.map((t) => t.y / S + 200));
  return { x: left, y: 30, width: right - left, height: bottom - 30 };
}
export function banquetView(config?: BanquetConfiguration) {
  const b = banquetBounds(config);
  return {
    x: (b.x - 30) * S,
    y: 0,
    width: (b.width + 60) * S,
    height: (b.height + 60) * S,
  };
}
// Seats and circulation occupy more space than the table itself.
export function canPlaceTable(
  point: Pick<BanquetTable, "x" | "y">,
  tables: readonly BanquetTable[],
) {
  const x = point.x / S,
    y = point.y / S;
  if (
    !Number.isFinite(x) ||
    !Number.isFinite(y) ||
    Math.abs(x) > 5000 ||
    y < 300 ||
    y > 5000
  )
    return false;
  if (x > 440 && x < 960 && y < 890) return false;
  // Keep a continuous central approach from the entrance to the dance floor.
  if (y >= 830 && x > 635 && x < 765) return false;
  return tables.every(
    (t) => Math.hypot(t.x - point.x, t.y - point.y) >= 75 * S,
  );
}
export function availableTablePositions(config?: BanquetConfiguration) {
  const tables = configuredTables(config);
  const maxY = Math.max(...tables.map((t) => t.y / S));
  // Preserve each original column's phase (300/350), including the stagger
  // beneath H, A, 51 and 23. Never derive the grid from rounded extra positions.
  const columns = new Map<number, number>();
  for (const table of banquetTables) {
    const x = Math.round(table.x / S);
    const y = Math.round(table.y / S);
    columns.set(x, Math.min(columns.get(x) ?? y, y));
  }
  const left = Math.min(...tables.map((t) => t.x / S));
  const right = Math.max(...tables.map((t) => t.x / S));
  for (let i = 1; 140 - i * 100 >= left - 100; i++)
    columns.set(140 - i * 100, i % 2 ? 300 : 350);
  for (let i = 1; 1260 + i * 100 <= right + 100; i++)
    columns.set(1260 + i * 100, i % 2 ? 300 : 350);
  columns.set(625, 900);
  columns.set(775, 900);
  const positions: Pick<BanquetTable, "x" | "y">[] = [];
  for (const [x, startY] of [...columns].sort(([a], [b]) => a - b)) {
    for (let y = startY; y <= maxY + 100; y += 100) {
      const point = { x: x * S, y: y * S };
      if (canPlaceTable(point, tables)) positions.push(point);
    }
  }
  return positions;
}
/** Align previously placed extras without moving the base or occupied tables. */
export function alignBanquetExtras(
  config: BanquetConfiguration,
  lockedLabels: ReadonlySet<string>,
) {
  let current = config;
  for (const table of config.extras) {
    if (lockedLabels.has(table.label)) continue;
    const without = {
      ...current,
      extras: current.extras.filter((t) => t.label !== table.label),
    };
    const nearest = availableTablePositions(without)
      .filter(
        (p) =>
          Math.abs(p.x - table.x) < S &&
          Math.abs(p.y - table.y) <= 50 * S + 0.01,
      )
      .sort(
        (a, b) =>
          Math.abs(a.y - table.y) - Math.abs(b.y - table.y) || a.y - b.y,
      )[0];
    if (nearest && (nearest.x !== table.x || nearest.y !== table.y)) {
      current = {
        ...current,
        extras: current.extras.map((t) =>
          t.label === table.label ? { ...t, ...nearest } : t,
        ),
      };
    }
  }
  return current;
}
export function validBanquetConfiguration(
  value: unknown,
): value is BanquetConfiguration {
  if (!value || typeof value !== "object") return false;
  const c = value as Record<string, unknown>;
  if (
    !Number.isSafeInteger(c.nextNumber) ||
    Number(c.nextNumber) < 59 ||
    !Array.isArray(c.extras) ||
    c.extras.length > 934
  )
    return false;
  const tables = [...banquetTables];
  for (const candidate of c.extras) {
    if (!candidate || typeof candidate !== "object") return false;
    const t = candidate as Record<string, unknown>;
    if (
      typeof t.label !== "string" ||
      !/^[1-9]\d*$/.test(t.label) ||
      !Number.isSafeInteger(Number(t.label)) ||
      Number(t.label) < 59 ||
      Number(t.label) >= Number(c.nextNumber) ||
      typeof t.x !== "number" ||
      typeof t.y !== "number"
    )
      return false;
    if (
      tables.some((existing) => existing.label === t.label) ||
      !canPlaceTable({ x: t.x, y: t.y }, tables)
    )
      return false;
    tables.push({ label: t.label, x: t.x, y: t.y });
  }
  return true;
}
export function banquetSeatId(
  table: BanquetTable,
  index: number,
  zoneId = "salon",
) {
  const baseIndex = banquetTables.findIndex((t) => t.label === table.label);
  return baseIndex >= 0
    ? `${zoneId}-${baseIndex * 10 + index + 1}`
    : `${zoneId}-extra-${table.label}-${index + 1}`;
}
