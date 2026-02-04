declare module "@mapbox/mapbox-gl-geocoder" {
  import mapboxgl from "mapbox-gl";

  export interface GeocoderResult {
    center: [number, number];
    place_name: string;
    context: Array<{ id: string; text: string }>;
  }

  export default class MapboxGeocoder {
    constructor(options: {
      accessToken: string;
      mapboxgl: typeof mapboxgl;
      marker?: boolean;
      placeholder?: string;
      countries?: string;
      bbox?: [number, number, number, number];
    });

    on(type: "result", fn: (e: { result: GeocoderResult }) => void): void;
  }
}
