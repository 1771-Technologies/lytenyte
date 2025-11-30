import { useMemo } from "react";

export function useYPositions() {
  return useMemo(() => {
    return new Uint32Array([0]);
  }, []);
}
