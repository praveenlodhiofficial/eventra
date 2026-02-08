/* -------------------------------------------------------------------------- */
/*                     Get Event Params (For Action)                      */
/* -------------------------------------------------------------------------- */

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
/*                     Get Performer Params (For Action)                      */
/* -------------------------------------------------------------------------- */

export type GetPerformerParams =
  | { id: string; slug?: never }
  | { slug: string; id?: never };

/* -------------------------------------------------------------------------- */
/*                     Find Performer Params (For DAL)                        */
/* -------------------------------------------------------------------------- */

export type FindPerformerParams = {
  id?: string;
  slug?: string;
};
