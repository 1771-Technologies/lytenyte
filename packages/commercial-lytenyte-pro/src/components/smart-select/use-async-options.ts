import { useMemo, useRef, useState } from "react";
import type { BaseOption } from "./type";
import { useEvent } from "@1771technologies/lytenyte-core/internal";

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

  const controllerRef = useRef<AbortController | null>(null);
  const loadOptions = useEvent((query) => {
    if (!p) return;

    if (controllerRef.current) controllerRef.current.abort();

    const opts = p(query);
    if (Array.isArray(opts)) {
      setOptions(opts);
      return;
    }

    const controller = new AbortController();
    controllerRef.current = controller;

    if (clearOnQuery) setOptions([]);
    setLoading(true);
    setError(null);
    opts
      .then((res) => {
        if (controller.signal.aborted) return;
        setOptions(res);
      })
      .catch((e) => {
        if (controller.signal.aborted) return;
        setError(e);
      })
      .finally(() => {
        if (controller.signal.aborted) return;
        setLoading(false);
      });
  });

  return useMemo(() => ({ loading, error, options, loadOptions }), [error, loadOptions, loading, options]);
}
