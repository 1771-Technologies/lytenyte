export function consumeDigits(source: string, pos: number, predicate: (ch: string) => boolean): number {
  while (pos < source.length && (predicate(source[pos]) || source[pos] === "_")) pos++;
  return pos;
}
