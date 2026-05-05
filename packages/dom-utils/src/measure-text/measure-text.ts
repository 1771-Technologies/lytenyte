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

import { isHTMLElement } from "../predicates/is-html-element.js";

let canvas: null | HTMLCanvasElement = null;
let context: null | CanvasRenderingContext2D = null;

export function measureText(
  text: string,
  reference?: HTMLElement | string | undefined | null,
): TextMetrics | null {
  if (typeof document === "undefined") return null;

  if (!canvas) {
    canvas = document.createElement("canvas");
    canvas.style.position = "fixed";
    canvas.style.top = "-9999px";
    canvas.role = "none";
    context = canvas.getContext("2d")!;
    document.body.appendChild(canvas);
  }

  let font: string;
  if (typeof reference === "string") font = reference;
  else if (isHTMLElement(reference)) {
    const style = getComputedStyle(reference);
    font = style.font;
  } else {
    const style = getComputedStyle(document.body);
    font = style.font;
  }

  context!.font = font;
  const measurement = context!.measureText(text);

  return measurement;
}
