import { useRef } from "react";
import type { Root } from "../../root";

export function useExtendedAPI(p: Root.Props) {
  const props = p as { apiExtension?: any };

  const previousAPI = useRef(null);
  const previousExtensions = useRef({});

  const api = useRef<Root.API>({} as any);

  const ext = props.apiExtension;
  if (previousAPI.current != ext) {
    // Remove the previous extensions keys
    const keys = Object.keys(previousExtensions.current);
    for (const k of keys) delete (api.current as any)[k];

    const nextExt = typeof ext === "function" ? ext(api.current) : ext;

    previousAPI.current = ext;
    previousExtensions.current = nextExt;
    if (previousExtensions.current) Object.assign(api.current, previousExtensions.current);
  }

  return api.current;
}
