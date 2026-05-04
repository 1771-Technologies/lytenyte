interface NavigatorUAData {
  brands: Array<{ brand: string; version: string }>;
  mobile: boolean;
  platform: string;
}

/**
 * Returns the platform string and maxTouchPoints from the navigator, preferring userAgentData
 * when available. Returns empty defaults when navigator is not defined.
 */
export function getNavigatorData(): { platform: string; maxTouchPoints: number } {
  if (typeof navigator === "undefined") {
    return { platform: "", maxTouchPoints: -1 };
  }

  const uaData = (navigator as any).userAgentData as NavigatorUAData | undefined;

  if (uaData?.platform) {
    return {
      platform: uaData.platform,
      maxTouchPoints: navigator.maxTouchPoints,
    };
  }

  return {
    platform: navigator.platform ?? "",
    maxTouchPoints: navigator.maxTouchPoints ?? -1,
  };
}
