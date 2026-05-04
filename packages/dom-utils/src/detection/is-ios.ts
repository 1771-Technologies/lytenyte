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

import { getNavigatorData } from "./get-navigator-data.js";

/**
 * Returns true if the current device is running iOS, including iPadOS devices that report as
 * MacIntel.
 */
export const isIOS = () => {
  const nav = getNavigatorData();
  // iPads can claim to be MacIntel
  return nav.platform === "MacIntel" && nav.maxTouchPoints > 1
    ? true
    : /iP(hone|ad|od)|iOS/.test(nav.platform);
};
