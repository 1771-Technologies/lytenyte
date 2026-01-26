export function canMoveInInput(input: HTMLInputElement) {
  const value = input.value;
  const cPos = input.selectionStart;

  if (cPos == null) return { start: false, end: false };
  if (cPos > 0 && cPos < value.length) return { start: false, end: false };
  if (cPos === 0 && value.length === 0) return { start: true, end: true };

  if (cPos === value.length) return { start: false, end: true };
  if (cPos === 0) return { start: true, end: false };

  return { start: false, end: false };
}
