"use client";

import { FunnelChart } from "./funnel-chart-bklitai";

const data = [
  { label: "Visitors", value: 12400, displayValue: "12.4k" },
  { label: "Leads", value: 6800, displayValue: "6.8k" },
  { label: "Qualified", value: 3200, displayValue: "3.2k" },
  { label: "Proposals", value: 1500, displayValue: "1.5k" },
  { label: "Closed", value: 620, displayValue: "620" },
];

export default function FunnelChartDemo7() {
  return (
    <div className="mx-auto w-[60%] max-w-3xl">
      <FunnelChart
        data={data}
        color="var(--chart-1)"
        layers={3}
        labelLayout="grouped"
        labelAlign="center"
        labelOrientation="vertical"
      />
    </div>
  );
}
