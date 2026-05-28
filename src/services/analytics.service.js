import { get } from "./api";

const LOCAL = "http://localhost:3000/api";

export async function getOverview() {
  const res = await fetch(`${LOCAL}/analytics/overview`);
  const data = await res.json();
  return data.data;
}

export async function fetchAnalyticsSummary() {
  const res = await fetch(`${LOCAL}/analytics/summary`);
  const data = await res.json();
  return data.data;
}

export async function fetchAnalyticsFiltered(filters = {}) {
  const params = new URLSearchParams();
  Object.entries(filters).forEach(([k, v]) => { if (v) params.append(k, v); });
  const res = await fetch(`${LOCAL}/analytics/filtered?${params.toString()}`);
  const data = await res.json();
  return data.data;
}