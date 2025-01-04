import { useLayoutEffect } from "react";

/**
 * A custom implementation of React's useLayoutEffect that safely handles Server-Side Rendering (SSR).
 * Falls back to a no-op function when window is undefined (server-side environment).
 *
 * @see {@link https://reactjs.org/link/uselayouteffect-ssr} for more details about SSR warnings
 * @internal
 */
export const useIsoEffect = typeof window !== "undefined" ? useLayoutEffect : () => {};
