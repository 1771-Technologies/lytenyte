import { useMemo, useState } from "react";
import type { BaseOption } from "./type";
import { useEvent } from "@1771technologies/lytenyte-core-experimental/internal";

export interface ComboOptionState<T extends BaseOption> {
  loading: boolean;
  error: unknown;
  options: T[];
  loadOptions: (query: any) => void;
}

export function useAsyncOptions<T extends BaseOption>(
  p: null | ((query: string) => Promise<T[]> | T[]),
  clearOnQuery: boolean,
): ComboOptionState<T> {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<unknown>(null);
  const [options, setOptions] = useState<T[]>([]);

  const loadOptions = useEvent((query) => {
    if (!p) return;

    const opts = p(query);
    if (Array.isArray(opts)) {
      setOptions(opts);
      return;
    }

    if (clearOnQuery) setOptions([]);
    setLoading(true);
    setError(null);
    opts
      .then((res) => setOptions(res))
      .catch((e) => setError(e))
      .finally(() => setLoading(false));
  });

  return useMemo(() => ({ loading, error, options, loadOptions }), [error, loadOptions, loading, options]);
}
