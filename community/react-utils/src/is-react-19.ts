import { version } from "react";

/**
 * Determines if the current React version is 19 or higher.
 *
 * This utility helps handle breaking changes in React's ref forwarding API:
 * - React ≤18: Must use React.forwardRef(); passing ref directly as prop throws warning
 * - React ≥19: forwardRef is deprecated; ref should be passed directly as prop
 *
 * @example
 * if (isReact19) {
 *   return function Component({ ref, ...props }) { ... }
 * } else {
 *   return React.forwardRef((props, ref) => { ... })
 * }
 *
 * @returns {boolean} True if React version is 19 or higher, false otherwise
 */
const react19 = parseInt(version.split(".")[0]) >= 19;
export const isReact19 = () => react19;
