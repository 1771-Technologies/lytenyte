/*
Copyright 2026 1771 Technologies

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/

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
