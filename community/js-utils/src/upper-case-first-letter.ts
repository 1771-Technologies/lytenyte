/**
 * Capitalizes the first letter of a string while preserving the rest of the string.
 *
 * @param string - The input string to be transformed
 * @returns The input string with its first letter capitalized
 *
 * @example
 * upperCaseFirstLetter("hello") // returns "Hello"
 * upperCaseFirstLetter("world") // returns "World"
 */
export function upperCaseFirstLetter(string: string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}
