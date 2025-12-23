import { useRef } from "react";
import type { Root } from "../../root";

export function useExtendedAPI(p: Root.Props) {
  const props = p as { apiExtension?: any };

  const previousExtensions = useRef(props.apiExtension ?? {});
  const api = useRef<Root.API>({} as any);
  if (previousExtensions.current !== props.apiExtension) {
    const keys = Object.keys(previousExtensions.current);
    for (const k of keys) delete (api.current as any)[k];

    previousExtensions.current = props.apiExtension ?? {};
    Object.assign(api, previousExtensions.current);
  }

  return api.current;
}
