// Adapted from soralabs/scroll-gallery. See ../README.md.
const MASK_HIDDEN =
  "linear-gradient(to bottom, transparent 0%, transparent 100%)";
export function createStripBounds(stripsCount: number) {
  return Array.from({ length: stripsCount }, (_, j) => {
    const posFromBottom = stripsCount - j - 1;
    const step = 100 / stripsCount;
    const lower = (posFromBottom + 1) * step;
    const upper = posFromBottom * step;
    return {
      lower,
      upperGap: upper - 0.1,
      delay: (j / stripsCount) * 0.5,
    };
  });
}

function mergeIntervals(intervals: { top: number; bottom: number }[]) {
  if (!intervals.length) {
    return [];
  }
  intervals.sort((a, b) => a.top - b.top);
  const merged = [{ ...intervals[0] }];
  for (let i = 1; i < intervals.length; i++) {
    const last = merged.at(-1);
    const next = intervals[i];
    if (!last) {
      break;
    }
    if (next.top <= last.bottom) {
      last.bottom = Math.max(last.bottom, next.bottom);
    } else {
      merged.push({ ...next });
    }
  }
  return merged;
}

export function buildStripMask(
  stripBounds: ReturnType<typeof createStripBounds>,
  getAdj: (j: number, bounds: (typeof stripBounds)[number]) => number,
) {
  const intervals: { top: number; bottom: number }[] = [];
  for (let j = 0; j < stripBounds.length; j++) {
    const bounds = stripBounds[j];
    const adj = Math.max(0, Math.min(1, getAdj(j, bounds)));
    if (adj <= 0) {
      continue;
    }
    const sliceHeight = bounds.lower - bounds.upperGap;
    intervals.push({
      top: bounds.lower - adj * sliceHeight,
      bottom: bounds.lower,
    });
  }
  const merged = mergeIntervals(intervals);
  if (!merged.length) {
    return MASK_HIDDEN;
  }
  const stops: string[] = [];
  let cursor = 0;
  for (const { top, bottom } of merged) {
    if (top > cursor) {
      stops.push(`transparent ${cursor}%`, `transparent ${top}%`);
    }
    stops.push(`black ${top}%`, `black ${bottom}%`);
    cursor = bottom;
  }
  if (cursor < 100) {
    stops.push(`transparent ${cursor}%`, "transparent 100%");
  }
  return `linear-gradient(to bottom, ${stops.join(", ")})`;
}
