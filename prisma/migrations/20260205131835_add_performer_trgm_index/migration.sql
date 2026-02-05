/*
  Purpose: Enable fast typeahead / fuzzy search on Performer.name

  Problem:
  Queries like:
    WHERE name ILIKE '%kar%'
  cause full table scans and become very slow as the table grows (10k+ rows).

  Why normal index is not enough:
  B-Tree indexes do NOT work with leading wildcards (%query%).

  Solution:
  Use PostgreSQL pg_trgm (trigram) extension + GIN index.
  This allows ILIKE / contains searches to use an index and run in milliseconds.

  Important:
  - Prisma cannot express this index in schema.prisma
  - This MUST live in a migration to stay in sync across environments
  - Do NOT remove this unless you also change the search strategy
*/

-- Enable trigram extension (safe if already enabled)
CREATE EXTENSION IF NOT EXISTS pg_trgm;

-- Trigram GIN index for fast fuzzy search on Performer.name
CREATE INDEX IF NOT EXISTS performers_name_trgm
ON "Performer"
USING gin (name gin_trgm_ops);
