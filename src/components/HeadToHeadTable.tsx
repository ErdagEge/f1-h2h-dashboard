import React from "react";
import { HeadToHeadStats } from "@/lib/f1Api";

interface Props {
  stats: HeadToHeadStats | null;
  driver1Name: string;
  driver2Name: string;
}

export default function HeadToHeadTable({ stats, driver1Name, driver2Name }: Props) {
  if (!stats) return null;
  return (
    <table className="border-collapse border mt-4 text-sm">
      <thead>
        <tr>
          <th className="border px-2 py-1"></th>
          <th className="border px-2 py-1 text-left">{driver1Name}</th>
          <th className="border px-2 py-1 text-left">{driver2Name}</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td className="border px-2 py-1 text-left">Wins</td>
          <td className="border px-2 py-1 text-center">{stats.driver1Wins}</td>
          <td className="border px-2 py-1 text-center">{stats.driver2Wins}</td>
        </tr>
        <tr>
          <td className="border px-2 py-1 text-left">Points</td>
          <td className="border px-2 py-1 text-center">{stats.driver1Points}</td>
          <td className="border px-2 py-1 text-center">{stats.driver2Points}</td>
        </tr>
        <tr>
          <td className="border px-2 py-1 text-left">Podiums</td>
          <td className="border px-2 py-1 text-center">{stats.driver1Podiums}</td>
          <td className="border px-2 py-1 text-center">{stats.driver2Podiums}</td>
        </tr>
        <tr>
          <td className="border px-2 py-1 text-left">Poles</td>
          <td className="border px-2 py-1 text-center">{stats.driver1Poles}</td>
          <td className="border px-2 py-1 text-center">{stats.driver2Poles}</td>
        </tr>
        <tr>
          <td className="border px-2 py-1 text-left">Ties</td>
          <td className="border px-2 py-1 text-center" colSpan={2}>{stats.ties}</td>
        </tr>
      </tbody>
    </table>
  );
}
