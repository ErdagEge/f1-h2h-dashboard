import React from "react";
import { Driver } from "@/lib/f1Api";

interface DriverSelectProps {
  label: string;
  drivers: Driver[];
  value: string;
  onChange: (value: string) => void;
}

export default function DriverSelect({ label, drivers, value, onChange }: DriverSelectProps) {
  return (
    <label className="flex flex-col gap-1">
      <span className="font-medium">{label}</span>
      <select
        className="border rounded px-2 py-1 bg-background text-foreground"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      >
        <option value="">Select driver</option>
        {drivers.map((d) => (
          <option key={d.driverId} value={d.driverId}>
            {d.givenName} {d.familyName}
          </option>
        ))}
      </select>
    </label>
  );
}
