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
 * Calls `run` immediately, then retries with exponential (or custom) back-off delays
 * until `run` returns `true` or the retry schedule is exhausted.
 *
 * `times` is consumed as a queue: each retry pops the first delay from the array and
 * schedules the next call via `setTimeout`. Retrying stops as soon as `run` returns
 * `true` or no delays remain.
 *
 * @param run - Function to execute. Return `true` to signal success and stop retrying.
 * @param times - Ordered list of millisecond delays between successive attempts.
 *                The array is mutated by `shift()` on each retry.
 *
 * @example
 * ```typescript
 * // Retry up to 3 times with increasing delays (100ms, 500ms, 2000ms)
 * runWithBackoff(() => attemptNetworkRequest(), [100, 500, 2000]);
 *
 * // Stop as soon as the callback reports success
 * let ready = false;
 * runWithBackoff(() => {
 *   if (ready) return true;
 *   ready = checkCondition();
 *   return ready;
 * }, [200, 400, 800]);
 * ```
 */
export function runWithBackoff(run: () => boolean, times: number[]) {
  const res = run();

  if (!times.length || res) return;

  const time = times.shift();
  setTimeout(() => runWithBackoff(run, times), time);
}
