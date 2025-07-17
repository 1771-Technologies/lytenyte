import { useCallback } from "react";

type PossibleRef<T> = React.RefCallback<T> | React.RefObject<T> | null;

/**
 * Custom hook that combines two refs into a single ref callback.
 * Useful when you need to simultaneously use multiple refs on a single element,
 * such as combining a forwarded ref with a local ref.
 *
 * @param left - First ref to be combined
 * @param right - Second ref to be combined
 * @returns A callback ref that updates both provided refs
 *
 * @example
 * function MyComponent({ forwardedRef }) {
 *   const localRef = useRef(null);
 *   const combinedRef = useCombinedRefs(forwardedRef, localRef);
 *
 *   return <div ref={combinedRef}>Content</div>;
 * }
 *
 * @template T The type of element being referenced
 */
export function useCombinedRefs<T>(
  left: PossibleRef<T | null> | undefined,
  right: PossibleRef<T | null> | undefined,
): React.RefCallback<T> {
  // Memoize the combined ref callback to maintain referential equality
  const combinedRef = useCallback(
    (element: T | null) => {
      // Helper function to update a single ref
      const updateRef = (ref: PossibleRef<T | null> | undefined) => {
        if (!ref) return;

        if (typeof ref === "function") {
          ref(element);
        } else {
          ref.current = element;
        }
      };

      // Update both refs
      updateRef(left);
      updateRef(right);
    },
    [left, right],
  );

  return combinedRef;
}
