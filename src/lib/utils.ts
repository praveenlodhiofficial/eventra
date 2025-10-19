import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
   return twMerge(clsx(inputs));
}

// CORS utility function for consistent headers across API routes
export function getCorsHeaders() {
   return {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS, PATCH",
      "Access-Control-Allow-Headers":
         "Content-Type, Authorization, X-Requested-With, Accept, Origin, Cache-Control, X-Requested-With",
      "Access-Control-Allow-Credentials": "true",
      "Access-Control-Max-Age": "86400",
   };
}

// CORS response helper for preflight OPTIONS requests
export function corsOptionsResponse() {
   return new Response(null, {
      status: 200,
      headers: getCorsHeaders(),
   });
}

export function generateSlug(text: string): string {
   return text
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, "") // Remove special characters except spaces and hyphens
      .replace(/[\s_-]+/g, "-") // Replace spaces and underscores with hyphens
      .replace(/^-+|-+$/g, ""); // Remove leading/trailing hyphens
}

export function formatDate(date: Date | null): string {
   if (!date) return "";
   return date.toLocaleDateString("en-US", {
      month: "short",
      day: "2-digit",
      year: "numeric",
   });
}

export const formatDateTimeLocal = (date: Date) => {
   const pad = (n: number) => String(n).padStart(2, "0");
   const yyyy = date.getFullYear();
   const MM = pad(date.getMonth() + 1);
   const dd = pad(date.getDate());
   const hh = pad(date.getHours());
   const mm = pad(date.getMinutes());
   return `${yyyy}-${MM}-${dd}T${hh}:${mm}`;
};
