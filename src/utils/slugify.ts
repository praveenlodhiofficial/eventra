export function slugify(
  input: string,
  opts = { lower: true, maxLength: undefined, fallback: "item" } as {
    lower?: boolean;
    maxLength?: number;
    fallback?: string;
  }
) {
  const { lower = true, maxLength, fallback = "item" } = opts;
  if (!input) return fallback;
  let s = input.normalize("NFKD").replace(/[\u0300-\u036f]/g, "");
  if (lower) s = s.toLowerCase();
  s = s
    .replace(/[^a-z0-9]+/gi, "-")
    .replace(/^-+|-+$/g, "")
    .replace(/-{2,}/g, "-");
  if (typeof maxLength === "number" && maxLength > 0) {
    s = s.slice(0, maxLength).replace(/-+$/g, "");
  }
  return s.length > 0 ? s : fallback;
}
