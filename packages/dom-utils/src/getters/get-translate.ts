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

const translateCache: Record<number, Record<number | string, string>> = {};

export function getTranslate(x: number, y: number | string) {
  const cached = translateCache[x]?.[y];
  if (cached) return cached;

  const v = `translate3d(${x}px, ${typeof y === "string" ? y : `${y}px`}, 0px)`;

  translateCache[x] ??= {};
  translateCache[x][y] = v;

  return v;
}
