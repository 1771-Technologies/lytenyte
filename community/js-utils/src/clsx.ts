/**
 * Constructs a space-separated string of CSS class names from the provided arguments.
 * Filters out falsy values (false, null, undefined) and joins the remaining class names with spaces.
 *
 * @param classes - An array of potential class names that can be strings, booleans, null, or undefined
 * @returns A single string containing all the valid class names separated by spaces
 *
 * @example
 * ```ts
 * clsx('btn', true && 'primary', false && 'secondary', null, undefined, 'active')
 * // Returns: 'btn primary active'
 * ```
 */
export function clsx(...classes: (string | boolean | undefined | null)[]) {
  const classNames = [];

  for (let i = 0; i < classes.length; i++) {
    const className = classes[i];
    if (className) classNames.push(className);
  }
  return classNames.join(" ");
}
