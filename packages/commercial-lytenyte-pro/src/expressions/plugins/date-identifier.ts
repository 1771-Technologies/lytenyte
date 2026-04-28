import type { Plugin } from "../plugin.js";

function toDate(value: unknown): Date | null {
  if (value instanceof Date) return value;
  if (typeof value === "string" || typeof value === "number") {
    const d = new Date(value);
    return isNaN(d.getTime()) ? null : d;
  }
  return null;
}

export function createDateIdentifierPlugin(options: { identifiers: string[] }): Plugin {
  const identifierSet = new Set(options.identifiers);

  return {
    name: "date-identifier",
    evaluate: (node, context) => {
      if (node.type !== "Identifier") return null;
      if (!identifierSet.has((node as any).name)) return null;

      const raw = context[(node as any).name];
      const date = toDate(raw);

      if (date === null) {
        if (raw === undefined || raw === null) return { value: null };
        throw new Error(`Context value for "${(node as any).name}" cannot be coerced to a Date`);
      }

      return { value: date };
    },
  };
}
