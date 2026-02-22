/* -------------------------------------------------------------------------- */
/*                     Get Event Category Params (For Action)                      */
/* -------------------------------------------------------------------------- */

export type GetEventCategoryParams =
  | { id: string; slug?: never }
  | { slug: string; id?: never };

/* -------------------------------------------------------------------------- */
/*                     Find Event Category Params (For DAL)                        */
/* -------------------------------------------------------------------------- */

export type FindEventCategoryParams = {
  id?: string;
  slug?: string;
};
