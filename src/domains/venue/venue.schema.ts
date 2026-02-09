import { z } from "zod";

/* -------------------------------------------------------------------------- */
/*                            Venue Schema                                    */
/* -------------------------------------------------------------------------- */

export const VenueSchema = z.object({
  name: z
    .string()
    .min(3, "Name must be at least 3 characters")
    .max(100, "Name cannot exceed 100 characters")
    .trim(),
  address: z.string().min(5, "Address must be at least 5 characters").trim(),
  city: z.string().min(3, "City must be at least 3 characters").trim(),
  state: z.string().min(3, "State must be at least 3 characters").trim(),
  country: z.string().min(3, "Country must be at least 3 characters").trim(),
  pincode: z.string().min(1, "Pincode is required").trim(),
});

export type VenueInput = z.input<typeof VenueSchema>;
export type Venue = z.output<typeof VenueSchema>;

/* -------------------------------------------------------------------------- */
/*                            Venue Summary Schema                            */
/* -------------------------------------------------------------------------- */

export const VenueSummarySchema = VenueSchema.pick({
  name: true,
  city: true,
}).extend({
  id: z.string(),
});

export type VenueSummaryInput = z.input<typeof VenueSummarySchema>;
export type VenueSummary = z.output<typeof VenueSummarySchema>;
