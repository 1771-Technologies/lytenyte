import { useCallback } from "react";

type PossibleRef<T> = React.RefCallback<T> | React.RefObject<T> | null;

export function useCombinedRefs<T>(
  ...refs: (PossibleRef<T | null> | undefined)[]
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

      refs.forEach(updateRef);
    },
    // eslint-disable-next-line react-hooks/use-memo, react-hooks/exhaustive-deps
    refs,
  );

  return combinedRef;
}
