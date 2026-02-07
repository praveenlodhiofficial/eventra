import { z } from "zod";

/* -------------------------------------------------------------------------- */
/*                            Performer Schema                                */
/* -------------------------------------------------------------------------- */

export const PerformerSchema = z.object({
  name: z.string().min(3).max(100).trim(),
  image: z.string().min(3).trim(),
  bio: z.string().min(3).trim(),
});

export type PerformerInput = z.input<typeof PerformerSchema>;
export type Performer = z.output<typeof PerformerSchema>;

/* -------------------------------------------------------------------------- */
/*                        Performer Summary Schema                          */
/* -------------------------------------------------------------------------- */

export const PerformerSummarySchema = PerformerSchema.pick({
  name: true,
  image: true,
}).extend({
  id: z.string(),
});

export type PerformerSummaryInput = z.input<typeof PerformerSummarySchema>;
export type PerformerSummary = z.output<typeof PerformerSummarySchema>;
