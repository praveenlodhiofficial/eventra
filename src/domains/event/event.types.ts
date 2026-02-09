/* -------------------------------------------------------------------------- */
/*                     Get Event Params (For Action)                      */
/* -------------------------------------------------------------------------- */
import { EventStatus } from "@/generated/prisma/enums";

export type GetEventParams =
  | { id: string; slug?: never }
  | { slug: string; id?: never };

/* -------------------------------------------------------------------------- */
/*                     Find Event Params (For DAL)                        */
/* -------------------------------------------------------------------------- */

export type FindEventParams = {
  id?: string;
  slug?: string;
};

/* -------------------------------------------------------------------------- */
/*                     Find Events Options (For DAL)                        */
/* -------------------------------------------------------------------------- */

export type FindEventsOptions = {
  status?: EventStatus;
};
