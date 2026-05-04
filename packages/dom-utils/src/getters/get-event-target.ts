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

function getComposedPath(event: any): EventTarget[] | undefined {
  return event.composedPath?.() ?? event.nativeEvent?.composedPath?.();
}

/**
 * Returns the event target, preferring the first element in the composed path to support shadow
 * DOM events.
 */
export function getEventTarget<T extends EventTarget>(
  event: Partial<Pick<UIEvent, "target" | "composedPath">>,
): T | null {
  const composedPath = getComposedPath(event);
  return (composedPath?.[0] ?? event.target) as T | null;
}
