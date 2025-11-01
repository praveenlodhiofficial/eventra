/**
 * Reverse geocoding utility using OpenStreetMap Nominatim API
 * Converts latitude/longitude coordinates to address components
 */

export interface LocationData {
   address?: string;
   city?: string;
   state?: string;
   country?: string;
   pinCode?: string;
}

interface NominatimResponse {
   address: {
      road?: string;
      house_number?: string;
      suburb?: string;
      city?: string;
      town?: string;
      village?: string;
      state?: string;
      postcode?: string;
      country?: string;
      country_code?: string;
   };
   display_name?: string;
}

/**
 * Reverse geocode coordinates to get address details
 * @param latitude - Latitude coordinate
 * @param longitude - Longitude coordinate
 * @returns Promise resolving to location data with address components
 */
export async function reverseGeocode(latitude: number, longitude: number): Promise<LocationData> {
   try {
      // Using Nominatim API (free, no API key required)
      // Rate limit: 1 request per second
      const response = await fetch(
         `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1`,
         {
            headers: {
               "User-Agent": "EventraApp/1.0", // Required by Nominatim
            },
         }
      );

      if (!response.ok) {
         throw new Error("Failed to fetch address data");
      }

      const data: NominatimResponse = await response.json();

      if (!data.address) {
         throw new Error("No address data found");
      }

      const addr = data.address;

      // Use display_name as primary source for full address (contains complete formatted address)
      // Fall back to constructing from parts if display_name is not available
      let address = data.display_name || "";

      if (!address) {
         // Build address from parts as fallback
         const addressParts: string[] = [];
         if (addr.house_number) addressParts.push(addr.house_number);
         if (addr.road) addressParts.push(addr.road);
         if (addr.suburb) addressParts.push(addr.suburb);
         const cityTownVillage = addr.city || addr.town || addr.village;
         if (cityTownVillage) addressParts.push(cityTownVillage);
         if (addr.state) addressParts.push(addr.state);
         if (addr.postcode) addressParts.push(addr.postcode);
         if (addr.country) addressParts.push(addr.country);
         address = addressParts.join(", ");
      }

      // Extract city (prefer city, fallback to town or village)
      const city = addr.city || addr.town || addr.village || "";

      // Extract state/province
      const state = addr.state || "";

      // Extract country
      const country = addr.country || "";

      // Extract postal code
      const pinCode = addr.postcode || "";

      return {
         address: address || undefined,
         city: city || undefined,
         state: state || undefined,
         country: country || undefined,
         pinCode: pinCode || undefined,
      };
   } catch (error) {
      console.error("Reverse geocoding error:", error);
      throw error;
   }
}
