// src/types/dashboard.ts
export type ChartType = "line" | "bar" | "pie" | "area";
export type TimeRange = "day" | "week" | "month" | "year";
export type SortOrder = "asc" | "desc";

export interface ChartData {
  date: string;
  passengers: number;
  revenue: number;
  cardIssued: number;
  stationTraffic: number;
}
