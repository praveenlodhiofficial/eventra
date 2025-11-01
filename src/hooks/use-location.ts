"use client";

import { reverseGeocode, type LocationData } from "@/lib/location";
import { useState } from "react";

export interface UseLocationReturn {
   isLoading: boolean;
   error: string | null;
   detectLocation: () => Promise<LocationData | null>;
   clearError: () => void;
}

/**
 * Custom hook to detect user's location using browser Geolocation API
 * and convert coordinates to address using reverse geocoding
 */
export function useLocation(): UseLocationReturn {
   const [isLoading, setIsLoading] = useState(false);
   const [error, setError] = useState<string | null>(null);

   const clearError = () => setError(null);

   const detectLocation = async (): Promise<LocationData | null> => {
      setIsLoading(true);
      setError(null);

      try {
         // Check if Geolocation API is available
         if (!navigator.geolocation) {
            throw new Error("Geolocation is not supported by your browser");
         }

         // Request user's location
         const position = await new Promise<GeolocationPosition>((resolve, reject) => {
            navigator.geolocation.getCurrentPosition(
               resolve,
               (err) => {
                  // Handle specific error types
                  switch (err.code) {
                     case err.PERMISSION_DENIED:
                        reject(
                           new Error(
                              "Location permission denied. Please enable location access in your browser settings."
                           )
                        );
                        break;
                     case err.POSITION_UNAVAILABLE:
                        reject(new Error("Location information is unavailable."));
                        break;
                     case err.TIMEOUT:
                        reject(new Error("Location request timed out. Please try again."));
                        break;
                     default:
                        reject(new Error("An unknown error occurred while getting your location."));
                  }
               },
               {
                  enableHighAccuracy: true,
                  timeout: 10000, // 10 seconds timeout
                  maximumAge: 0, // Don't use cached location
               }
            );
         });

         const { latitude, longitude } = position.coords;

         // Reverse geocode to get address
         const locationData = await reverseGeocode(latitude, longitude);

         setIsLoading(false);
         return locationData;
      } catch (err) {
         const errorMessage = err instanceof Error ? err.message : "Failed to detect location";
         setError(errorMessage);
         setIsLoading(false);
         return null;
      }
   };

   return {
      isLoading,
      error,
      detectLocation,
      clearError,
   };
}
