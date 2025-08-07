export interface MetaOptions {
  readonly title?: string;
  readonly numbers?: boolean;
  readonly noCopy?: boolean;
}

export function parseMeta(input: string): MetaOptions {
  const result: Record<string, string | boolean> = {};

  // Regex to match key="value" or standalone key (flag-style)
  const regex = /(\w+)(="([^"]*)")?/g;
  let match: RegExpExecArray | null;

  while ((match = regex.exec(input)) !== null) {
    const key = match[1];
    const value = match[3];
    result[key] = value !== undefined ? value : true;
  }

  return result;
}
