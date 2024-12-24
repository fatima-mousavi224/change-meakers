import {
  Bar,
  BarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import React from "react";
import { PaymentInfo } from "@prisma/client";

interface ChartProps {
  donations: PaymentInfo[];
  selectedYear: number;
}

export default function Chart({ donations, selectedYear }: ChartProps) {
  // Filter donations by selected year and create monthly totals
  const monthlyTotals = new Map();

  // Initialize all months with 0
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  months.forEach((month) => monthlyTotals.set(month, 0));

  // Sum donations for the selected year
  donations
    .filter(
      (donation) => new Date(donation.createdAt).getFullYear() === selectedYear
    )
    .forEach((donation) => {
      const date = new Date(donation.createdAt);
      const monthKey = date.toLocaleString("default", { month: "short" });
      const currentTotal = monthlyTotals.get(monthKey) || 0;
      monthlyTotals.set(monthKey, currentTotal + donation.amount);
    });

  // Convert map to array format needed for the chart
  const data = Array.from(monthlyTotals, ([label, value]) => ({
    label,
    value,
  }));

  return (
    <ResponsiveContainer
      width="100%"
      height={250}
      className="bg-white rounded-[20px] p-2 py-4 pb-10"
    >
      <BarChart data={data}>
        <Tooltip />
        <XAxis dataKey="label" />
        <YAxis />
        <Bar
          className="rounded-xl"
          dataKey="value"
          barSize={50}
          style={{ fill: "#134c83" }}
        />
      </BarChart>
    </ResponsiveContainer>
  );
}
