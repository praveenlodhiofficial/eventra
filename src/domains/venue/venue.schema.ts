import { z } from "zod";

/* -------------------------------------------------------------------------- */
/*                            Venue Schema                                    */
/* -------------------------------------------------------------------------- */

export const VenueSchema = z.object({
  name: z.string().min(3).max(100).trim(),
  address: z.string().min(5).trim(),
  city: z.string().min(3).trim(),
  state: z.string().min(3).trim(),
  country: z.string().min(3).trim(),
  pincode: z.string().min(1).trim(),
});

export type VenueInput = z.input<typeof VenueSchema>;
export type Venue = z.output<typeof VenueSchema>;
