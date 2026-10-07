"use client";
import Component from "./area-chart-subframeapp";

export default function DemoFour() {
  return (
    <Component
      className="max-w-3xl h-56"
      dark={false}
      stacked={false}
      index="Hour"
      categories={["Active Users"]}
      data={[
        { Hour: "09:00", "Active Users": 42 },
        { Hour: "10:00", "Active Users": 58 },
        { Hour: "11:00", "Active Users": 61 },
        { Hour: "12:00", "Active Users": 45 },
        { Hour: "13:00", "Active Users": 70 },
        { Hour: "14:00", "Active Users": 76 },
        { Hour: "15:00", "Active Users": 68 },
        { Hour: "16:00", "Active Users": 80 },
      ]}
      colors={["#0b544a"]}
    />
  );
}
