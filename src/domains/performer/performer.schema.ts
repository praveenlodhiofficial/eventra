import { z } from "zod";

/* -------------------------------------------------------------------------- */
/*                            Performer Schema                                */
/* -------------------------------------------------------------------------- */

export const PerformerSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(3, "Name must be at least 3 characters").max(100).trim(),
  role: z.string().min(2, "Role must be at least 2 characters").max(50).trim(),
  image: z.string().min(1, "Image is required").trim(),
  bio: z.string().min(10, "Bio must be at least 10 characters").trim(),
});

export type PerformerInput = z.input<typeof PerformerSchema>;
export type Performer = z.output<typeof PerformerSchema>;

/* -------------------------------------------------------------------------- */
/*                        Performer Summary Schema                          */
/* -------------------------------------------------------------------------- */

export const PerformerSummarySchema = PerformerSchema.pick({
  name: true,
  image: true,
  role: true,
}).extend({
  id: z.string(),
  slug: z.string().optional(),
});

export type PerformerSummaryInput = z.input<typeof PerformerSummarySchema>;
export type PerformerSummary = z.output<typeof PerformerSummarySchema>;
