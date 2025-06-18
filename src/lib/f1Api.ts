import { z } from "zod";

export interface Driver {
  driverId: string;
  permanentNumber?: string;
  code?: string;
  givenName: string;
  familyName: string;
  dateOfBirth: string;
  nationality: string;
}

export interface RaceResult {
  season: string;
  round: string;
  raceName: string;
  date: string;
  driverId: string;
  position?: number;
}

export interface HeadToHeadStats {
  season: string;
  driver1Wins: number;
  driver2Wins: number;
  ties: number;
}

const BASE_URL = "https://ergast.com/api/f1";

const driverSchema = z.object({
  driverId: z.string(),
  permanentNumber: z.string().optional(),
  code: z.string().optional(),
  givenName: z.string(),
  familyName: z.string(),
  dateOfBirth: z.string(),
  nationality: z.string(),
});

const resultSchema = z.object({
  position: z.string().optional(),
  Driver: driverSchema,
});

const raceSchema = z.object({
  season: z.string(),
  round: z.string(),
  raceName: z.string(),
  date: z.string(),
  Results: z.array(resultSchema),
});

const racesResponseSchema = z.object({
  MRData: z.object({
    RaceTable: z.object({
      season: z.string(),
      Races: z.array(raceSchema),
    }),
  }),
});

const driversResponseSchema = z.object({
  MRData: z.object({
    DriverTable: z.object({
      Drivers: z.array(driverSchema),
    }),
  }),
});

async function fetchJson<T>(url: string, schema: z.Schema<T>): Promise<T> {
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`Failed to fetch ${url}: ${res.status}`);
  }
  const json = await res.json();
  return schema.parse(json);
}

export async function getDrivers(season: string): Promise<Driver[]> {
  const data = await fetchJson(
    `${BASE_URL}/${season}/drivers.json?limit=1000`,
    driversResponseSchema
  );
  return data.MRData.DriverTable.Drivers;
}

interface RaceResultInternal {
  season: string;
  round: string;
  raceName: string;
  date: string;
  Results: Array<{ position?: string; Driver: Driver }>;
}

export async function getRaceResults(season: string): Promise<RaceResultInternal[]> {
  const data = await fetchJson(
    `${BASE_URL}/${season}/results.json?limit=1000`,
    racesResponseSchema
  );
  return data.MRData.RaceTable.Races;
}

function parsePosition(position?: string): number {
  const parsed = position ? parseInt(position, 10) : NaN;
  return isNaN(parsed) ? Infinity : parsed;
}

export async function getHeadToHead(
  season: string,
  driver1Id: string,
  driver2Id: string
): Promise<HeadToHeadStats> {
  const races = await getRaceResults(season);
  let driver1Wins = 0;
  let driver2Wins = 0;
  let ties = 0;

  for (const race of races) {
    const result1 = race.Results.find((r) => r.Driver.driverId === driver1Id);
    const result2 = race.Results.find((r) => r.Driver.driverId === driver2Id);
    if (!result1 || !result2) continue;
    const pos1 = parsePosition(result1.position);
    const pos2 = parsePosition(result2.position);
    if (pos1 === pos2) {
      ties += 1;
    } else if (pos1 < pos2) {
      driver1Wins += 1;
    } else {
      driver2Wins += 1;
    }
  }

  return { season, driver1Wins, driver2Wins, ties };
}
