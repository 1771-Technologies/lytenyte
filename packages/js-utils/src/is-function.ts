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
 * Type guard that checks whether a value is a function.
 * Accepts any callable: regular functions, arrow functions, async functions,
 * generator functions, built-ins, and class constructors.
 *
 * @param value - The value to test
 * @returns `true` if `value` is a function, narrowing its type to `(...args: any) => any`
 *
 * @example
 * ```typescript
 * isFunction(() => {});          // true
 * isFunction(async () => {});    // true
 * isFunction(function* () {});   // true
 * isFunction(Math.max);          // true
 * class Foo {}
 * isFunction(Foo);               // true  — class constructor is a function
 * isFunction(new Foo());         // false — instances are not functions
 * isFunction(null);              // false
 * isFunction(42);                // false
 * ```
 */
export const isFunction = (value: unknown): value is (...args: any) => any => typeof value === "function";
