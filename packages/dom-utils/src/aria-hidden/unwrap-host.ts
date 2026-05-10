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

/**
 * Walks up the DOM tree from `node` to find the nearest shadow host ancestor.
 *
 * If `node` is itself a `ShadowRoot`, its host element is returned immediately.
 * Otherwise the function recurses through `parentNode` until it finds a shadow
 * root (and returns its host) or reaches the top of the tree (and returns null).
 */
export const unwrapHost = (node: Element | ShadowRoot): Element | null =>
  node && ((node as ShadowRoot).host || unwrapHost(node.parentNode as Element));
