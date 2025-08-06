import { useEffect } from "react";

export function useOnWindowResize(onWindowResize: (event: Event) => void) {
  useEffect(() => {
    const cb = onWindowResize;
    window.addEventListener("resize", cb);
    return () => void window.removeEventListener("resize", cb);
  }, [onWindowResize]);
}
