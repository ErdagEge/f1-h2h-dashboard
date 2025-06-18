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
  driver1Points: number;
  driver2Points: number;
  driver1Podiums: number;
  driver2Podiums: number;
  driver1Poles: number;
  driver2Poles: number;
}

const BASE_URL = "https://ergast.com/api/f1";

// Simple in-memory caches keyed by season
const driversCache: Record<string, Driver[]> = {};


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
  grid: z.string().optional(),
  points: z.string().optional(),
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
  if (driversCache[season]) {
    return driversCache[season];
  }
  const data = await fetchJson(
    `${BASE_URL}/${season}/drivers.json?limit=1000`,
    driversResponseSchema
  );
  const drivers = data.MRData.DriverTable.Drivers;
  driversCache[season] = drivers;
  return drivers;
}

interface RaceResultInternal {
  season: string;
  round: string;
  raceName: string;
  date: string;
  Results: Array<{ position?: string; grid?: string; points?: string; Driver: Driver }>;
}

const raceResultsCache: Record<string, RaceResultInternal[]> = {};

export async function getRaceResults(season: string): Promise<RaceResultInternal[]> {
  if (raceResultsCache[season]) {
    return raceResultsCache[season];
  }
  const data = await fetchJson(
    `${BASE_URL}/${season}/results.json?limit=1000`,
    racesResponseSchema
  );
  const races = data.MRData.RaceTable.Races;
  raceResultsCache[season] = races;
  return races;
}

function parsePosition(position?: string): number {
  const parsed = position ? parseInt(position, 10) : NaN;
  return isNaN(parsed) ? Infinity : parsed;
}

function parseNumber(value?: string): number {
  const parsed = value ? parseFloat(value) : NaN;
  return isNaN(parsed) ? 0 : parsed;
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
  let driver1Points = 0;
  let driver2Points = 0;
  let driver1Podiums = 0;
  let driver2Podiums = 0;
  let driver1Poles = 0;
  let driver2Poles = 0;

  for (const race of races) {
    const result1 = race.Results.find((r) => r.Driver.driverId === driver1Id);
    const result2 = race.Results.find((r) => r.Driver.driverId === driver2Id);
    if (!result1 || !result2) continue;
    const pos1 = parsePosition(result1.position);
    const pos2 = parsePosition(result2.position);
    const grid1 = parsePosition(result1.grid);
    const grid2 = parsePosition(result2.grid);
    const points1 = parseNumber(result1.points);
    const points2 = parseNumber(result2.points);
    if (pos1 === pos2) {
      ties += 1;
    } else if (pos1 < pos2) {
      driver1Wins += 1;
    } else {
      driver2Wins += 1;
    }
    driver1Points += points1;
    driver2Points += points2;
    if (pos1 <= 3) driver1Podiums += 1;
    if (pos2 <= 3) driver2Podiums += 1;
    if (grid1 === 1) driver1Poles += 1;
    if (grid2 === 1) driver2Poles += 1;
  }

  return {
    season,
    driver1Wins,
    driver2Wins,
    ties,
    driver1Points,
    driver2Points,
    driver1Podiums,
    driver2Podiums,
    driver1Poles,
    driver2Poles,
  };
}
