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

interface DOMEventMap extends DocumentEventMap, WindowEventMap, HTMLElementEventMap {}

/**
 * Adds an event listener to the given target and returns a cleanup function that
 * removes it when called.
 */
export const addDomEvent = <K extends keyof DOMEventMap>(
  target: EventTarget | null,
  eventName: K,
  handler: (event: DOMEventMap[K]) => void,
  options?: boolean | AddEventListenerOptions,
) => {
  const node = target;
  node?.addEventListener(eventName, handler as any, options);
  return () => {
    node?.removeEventListener(eventName, handler as any, options);
  };
};
