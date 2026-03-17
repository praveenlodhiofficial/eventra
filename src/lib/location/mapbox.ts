import { config } from "@/lib/config";
import type { LocationResult } from "@/lib/location/types";

type MapboxFeature = {
  place_name: string;
  center: [number, number]; // [lng, lat]
};

export async function searchLocations(
  query: string
): Promise<LocationResult[]> {
  const q = query.trim();
  if (!q) return [];

  const url =
    "https://api.mapbox.com/geocoding/v5/mapbox.places/" +
    encodeURIComponent(q) +
    `.json?access_token=${encodeURIComponent(config.mapbox.access_token)}&autocomplete=true&limit=7`;

  const res = await fetch(url);
  if (!res.ok) return [];

  const data = (await res.json()) as { features?: MapboxFeature[] };
  const features = data.features ?? [];

  return features.map((f) => ({
    name: f.place_name,
    lat: f.center[1],
    lng: f.center[0],
  }));
}

export async function reverseGeocode(
  lng: number,
  lat: number
): Promise<LocationResult | null> {
  const url =
    "https://api.mapbox.com/geocoding/v5/mapbox.places/" +
    `${encodeURIComponent(lng)},${encodeURIComponent(lat)}` +
    `.json?access_token=${encodeURIComponent(config.mapbox.access_token)}&limit=1`;

  const res = await fetch(url);
  if (!res.ok) return null;

  const data = (await res.json()) as { features?: MapboxFeature[] };
  const f = data.features?.[0];
  if (!f) return null;

  return {
    name: f.place_name,
    lat: f.center[1],
    lng: f.center[0],
  };
}
