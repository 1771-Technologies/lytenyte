import { useState, useEffect } from "react";
import { useRouter } from "waku";

export function useQueryParamState<T>(
  key: string,
  defaultValue: T,
): [T, React.Dispatch<React.SetStateAction<T>>] {
  const { query } = useRouter();

  const getInitialValue = (): T => {
    try {
      const params = new URLSearchParams(query);
      const value = params.get(key);
      return value !== null ? (JSON.parse(value) as T) : defaultValue;
    } catch (error) {
      console.error(`Error parsing query param "${key}":`, error);
      return defaultValue;
    }
  };

  const [state, setState] = useState<T>(getInitialValue);

  useEffect(() => {
    try {
      const params = new URLSearchParams(query);
      const currentValueRaw = params.get(key);

      const stateStringified = JSON.stringify(state);
      const defaultStringified = JSON.stringify(defaultValue);

      if (stateStringified === defaultStringified) {
        // Clean up param if state equals default
        if (params.has(key)) {
          params.delete(key);
          const newUrl = `${window.location.pathname}?${params.toString()}`;
          window.history.replaceState(null, "", newUrl);
        }
      } else {
        // Only update param if state differs from both query and default
        if (currentValueRaw !== stateStringified) {
          params.set(key, stateStringified);
          const newUrl = `${window.location.pathname}?${params.toString()}`;
          window.history.replaceState(null, "", newUrl);
        }
      }
    } catch (error) {
      console.error(`Error updating query param "${key}":`, error);
    }
  }, [key, query, state, defaultValue]);

  return [state, setState];
}
