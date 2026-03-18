interface NavigatorUAData {
  brands: Array<{ brand: string; version: string }>;
  mobile: boolean;
  platform: string;
}

// Avoid Chrome DevTools blue warning.
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
