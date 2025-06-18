'use client'

import React, { useEffect, useState } from "react";
import { Driver, getDrivers, getHeadToHead, HeadToHeadStats } from "@/lib/f1Api";
import DriverSelect from "./DriverSelect";
import HeadToHeadTable from "./HeadToHeadTable";

export default function DriverComparison() {
  const [season, setSeason] = useState("2023");
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [driver1, setDriver1] = useState("");
  const [driver2, setDriver2] = useState("");
  const [stats, setStats] = useState<HeadToHeadStats | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setError(null);
    getDrivers(season)
      .then(setDrivers)
      .catch(() => setError("Failed to load drivers. Please try again."));
  }, [season]);

  const compare = async () => {
    if (!driver1 || !driver2) return;
    setLoading(true);
    setError(null);
    try {
      const s = await getHeadToHead(season, driver1, driver2);
      setStats(s);
    } catch (e) {
      console.error(e);
      setError("Failed to load race results. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const driver1Name = drivers.find((d) => d.driverId === driver1);
  const driver2Name = drivers.find((d) => d.driverId === driver2);

  return (
    <div className="flex flex-col gap-4 max-w-md mx-auto p-4">
      <label className="flex flex-col gap-1">
        <span className="font-medium">Season</span>
        <input
          className="border rounded px-2 py-1 bg-background text-foreground"
          value={season}
          onChange={(e) => setSeason(e.target.value)}
          placeholder="Season"
        />
      </label>

      <DriverSelect
        label="Driver 1"
        drivers={drivers}
        value={driver1}
        onChange={setDriver1}
      />
      <DriverSelect
        label="Driver 2"
        drivers={drivers}
        value={driver2}
        onChange={setDriver2}
      />
      <button
        className="border rounded px-4 py-2 bg-foreground text-background disabled:opacity-50"
        onClick={compare}
        disabled={!driver1 || !driver2 || loading}
      >
        {loading ? "Comparing..." : "Compare"}
      </button>

      {error && <p className="text-red-500">{error}</p>}

      {stats && driver1Name && driver2Name && (
        <HeadToHeadTable
          stats={stats}
          driver1Name={`${driver1Name.givenName} ${driver1Name.familyName}`}
          driver2Name={`${driver2Name.givenName} ${driver2Name.familyName}`}
        />
      )}
    </div>
  );
}
