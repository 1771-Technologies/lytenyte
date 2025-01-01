/**
 * Pads a string from the right to reach a target length using a specified padding character.
 *
 * @description
 * This function adds padding characters to the right side of a string until it reaches
 * the specified target length. If the input string is already equal to or longer than
 * the target length, it is returned unchanged.
 *
 * @param str - The string to pad
 * @param targetLength - The desired final length of the string
 * @param padChar - The character to use for padding. Defaults to a space character
 *
 * @returns The padded string. If the input string length is greater than or equal to
 *          the target length, returns the original string unchanged
 *
 * @example
 * // Pad with spaces (default)
 * padStringRight("123", 5)      // "123  "
 *
 * // Pad with custom character
 * padStringRight("123", 5, "0") // "12300"
 *
 * // No padding needed
 * padStringRight("12345", 5)    // "12345"
 * padStringRight("123456", 5)   // "123456"
 *
 * // Multi-character padding
 * padStringRight("abc", 7, "-*") // "abc-*-*"
 */
export function padStringRight(str: string, targetLength: number, padChar = " "): string {
  if (str.length >= targetLength) {
    return str;
  }

  const paddingNeeded = targetLength - str.length;
  const padding = padChar.repeat(paddingNeeded);

  return str + padding;
}
