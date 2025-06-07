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
import { getCheckedRadio } from "./get-checked-radio.js";
import { getRootNode } from "./get-root-node.js";

export const isTabbableRadio = (node: HTMLInputElement) => {
  if (!node.name) {
    return true;
  }
  const radioScope = (node.form || getRootNode(node)) as HTMLElement;
  const queryRadios = function (name: string) {
    return radioScope.querySelectorAll('input[type="radio"][name="' + name + '"]');
  };

  let radioSet;
  if (
    typeof window !== "undefined" &&
    typeof window.CSS !== "undefined" &&
    typeof window.CSS.escape === "function"
  ) {
    radioSet = queryRadios(window.CSS.escape(node.name));
  } else {
    radioSet = queryRadios(node.name);
  }

  const checked = getCheckedRadio(radioSet as unknown as HTMLElement[], node.form!);
  return !checked || checked === node;
};
