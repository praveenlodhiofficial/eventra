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
