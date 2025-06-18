"use client";

import React from "react";
import { HeadToHeadStats } from "@/lib/f1Api";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

interface Props {
  stats: HeadToHeadStats;
  driver1Name: string;
  driver2Name: string;
}

export default function HeadToHeadChart({
  stats,
  driver1Name,
  driver2Name,
}: Props) {
  const data = [
    { name: driver1Name, value: stats.driver1Wins },
    { name: driver2Name, value: stats.driver2Wins },
    { name: "Ties", value: stats.ties },
  ];

  return (
    <div className="w-full h-72 mt-4">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis allowDecimals={false} />
          <Tooltip />
          <Bar dataKey="value" fill="#8884d8" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
