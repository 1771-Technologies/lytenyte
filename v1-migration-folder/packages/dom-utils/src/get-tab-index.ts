/*
Copyright 2025 1771 Technologies

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

import { hasTabIndex } from "./has-tab-index.js";
import { isContentEditable } from "./is-content-editable.js";

export const getTabIndex = (node: HTMLElement) => {
  if (!node) {
    throw new Error("No node provided");
  }

  if (node.tabIndex < 0) {
    // in Chrome, <details/>, <audio controls/> and <video controls/> elements get a default
    // `tabIndex` of -1 when the 'tabindex' attribute isn't specified in the DOM,
    // yet they are still part of the regular tab order; in FF, they get a default
    // `tabIndex` of 0; since Chrome still puts those elements in the regular tab
    // order, consider their tab index to be 0.
    // Also browsers do not return `tabIndex` correctly for contentEditable nodes;
    // so if they don't have a tabindex attribute specifically set, assume it's 0.
    if (
      (/^(AUDIO|VIDEO|DETAILS)$/.test(node.tagName) || isContentEditable(node)) &&
      !hasTabIndex(node)
    ) {
      return 0;
    }
  }

  return node.tabIndex;
};
