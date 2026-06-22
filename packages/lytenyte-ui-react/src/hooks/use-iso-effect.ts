import { useEffect, useLayoutEffect } from "react";

export const useIsoEffect = typeof window !== "undefined" ? useLayoutEffect : useEffect;
