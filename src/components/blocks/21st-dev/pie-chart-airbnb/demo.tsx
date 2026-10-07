"use client";
import { PieChart } from "./pie-chart-airbnb";

const DemoPieChart = () => {
  const width = 600;
  const height = 400;

  return (
    <div className="flex w-full min-h-[400px] justify-center items-center bg-gray-100">
      <PieChart width={width} height={height} animate={true} />
    </div>
  );
};

export { DemoPieChart };
