/**
 * Pads a string from the left to reach a target length using a specified padding character.
 *
 * @description
 * This function adds padding characters to the left side of a string until it reaches
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
 * padStringLeft("123", 5)      // "  123"
 *
 * // Pad with custom character
 * padStringLeft("123", 5, "0") // "00123"
 *
 * // No padding needed
 * padStringLeft("12345", 5)    // "12345"
 * padStringLeft("123456", 5)   // "123456"
 */
export function padStringLeft(str: string, targetLength: number, padChar = " "): string {
  if (str.length >= targetLength) {
    return str;
  }
  const paddingNeeded = targetLength - str.length;
  const padding = padChar.repeat(paddingNeeded);
  return padding + str;
}
