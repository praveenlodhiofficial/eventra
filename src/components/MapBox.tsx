"use client";

import { useEffect, useRef } from "react";

import MapboxGeocoder, {
  type GeocoderResult,
} from "@mapbox/mapbox-gl-geocoder";
import mapboxgl, { IControl } from "mapbox-gl";

import { config } from "@/lib/config";
import { cn } from "@/lib/utils";

mapboxgl.accessToken = config.mapbox.access_token;

type MapBoxProps = {
  onLocationSelect: (data: {
    address: string;
    city: string;
    state: string;
    country: string;
    pincode: string;
    lng: number;
    lat: number;
  }) => void;
  className?: string;
};

export function MapBox({ onLocationSelect, className }: MapBoxProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<mapboxgl.Map | null>(null);
  const markerRef = useRef<mapboxgl.Marker | null>(null);

  const extractDetails = (feature: GeocoderResult) => {
    const context = feature.context || [];

    const find = (type: string) =>
      context.find((c: { id: string; text: string }) => c.id.includes(type))
        ?.text || "";

    return {
      address: feature.place_name,
      city: find("place"),
      state: find("region"),
      country: find("country"),
      pincode: find("postcode"),
    };
  };

  useEffect(() => {
    if (!mapRef.current) return;

    const map = new mapboxgl.Map({
      container: mapRef.current,
      style: "mapbox://styles/mapbox/streets-v12",
      center: [78.9629, 20.5937],
      zoom: 4,
    });

    mapInstance.current = map;

    // ---------- Geocoder (search box) ----------
    const geocoder = new MapboxGeocoder({
      accessToken: mapboxgl.accessToken!,
      mapboxgl,
      marker: false,
      placeholder: "Search venue location...",
      countries: "in", // ✅ only India results
      bbox: [68.1, 6.5, 97.4, 37.6], // ✅ India bounding box
    });

    map.addControl(geocoder as unknown as IControl);

    geocoder.on("result", (e: { result: GeocoderResult }) => {
      const { center } = e.result;

      if (markerRef.current) markerRef.current.remove();

      markerRef.current = new mapboxgl.Marker().setLngLat(center).addTo(map);

      const details = extractDetails(e.result);

      onLocationSelect({
        ...details,
        lng: center[0],
        lat: center[1],
      });

      map.flyTo({ center, zoom: 15 });
    });

    // ---------- Click on map ----------
    map.on("click", async (e) => {
      const { lng, lat } = e.lngLat;

      if (markerRef.current) markerRef.current.remove();
      markerRef.current = new mapboxgl.Marker()
        .setLngLat([lng, lat])
        .addTo(map);

      const res = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${lng},${lat}.json?access_token=${mapboxgl.accessToken}`
      );
      const data = await res.json();
      const feature = data.features[0];

      const details = extractDetails(feature);

      onLocationSelect({
        ...details,
        lng,
        lat,
      });
    });

    return () => map.remove();
  }, [onLocationSelect]);

  return (
    <div ref={mapRef} className={cn("h-80 w-full rounded-xl", className)} />
  );
}
