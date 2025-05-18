import { useState } from "react";

/**
 * A custom React hook that manages hover state and provides handlers for mouse enter/leave events.
 *
 * @returns A tuple containing:
 *  - [0] boolean: The current hover state
 *  - [1] object: An object containing mouse event handlers:
 *    - onMouseEnter: Function to handle mouse enter events
 *    - onMouseLeave: Function to handle mouse leave events
 *
 * @example
 * ```tsx
 * function MyComponent() {
 *   const [isHovered, hoverHandlers] = useHovered();
 *
 *   return (
 *     <div {...hoverHandlers}>
 *       {isHovered ? 'Hovered!' : 'Not hovered'}
 *     </div>
 *   );
 * }
 * ```
 */
export function useHovered() {
  const [hovered, setHovered] = useState(false);
  return [
    hovered,
    {
      onMouseEnter: () => setHovered(true),
      onMouseLeave: () => setHovered(false),
    },
  ] as const;
}
