import { hasUpperCaseLetter } from "./has-uppercase-letter";

export function smartStringIncludes(src: string, query: string) {
  const left = src.trim();
  const q = query.trim();
  if (hasUpperCaseLetter(q)) return left.includes(q);

  return left.toLowerCase().includes(q.toLowerCase());
}
