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
 * Returns a Promise that resolves after the given number of milliseconds.
 * Useful for introducing deliberate pauses in async flows.
 *
 * @param ms - Duration to wait in milliseconds (default: `200`)
 * @returns A Promise that resolves (with `undefined`) after `ms` milliseconds
 *
 * @example
 * ```typescript
 * await sleep();       // waits 200 ms
 * await sleep(1000);   // waits 1 second
 * ```
 */
export function sleep(ms: number = 200) {
  return new Promise((res) => setTimeout(res, ms));
}

/**
 * Alias for {@link sleep} with a shorter default delay of `20ms`.
 * Intended for brief pauses, such as yielding to the event loop in tests.
 *
 * @param ms - Duration to wait in milliseconds (default: `20`)
 * @returns A Promise that resolves after `ms` milliseconds
 *
 * @example
 * ```typescript
 * await wait();      // waits 20 ms
 * await wait(100);   // waits 100 ms
 * ```
 */
export function wait(ms: number = 20) {
  return sleep(ms);
}
