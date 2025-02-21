export function hasUppercaseLetter(s: string) {
  for (let i = 0; i < s.length; i++) {
    const char = s[i];

    if (char.toUpperCase() === char) return true;
  }

  return false;
}
