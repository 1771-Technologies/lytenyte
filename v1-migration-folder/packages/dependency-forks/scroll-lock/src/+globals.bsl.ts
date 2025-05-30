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
import type { BodyStyleType, Lock } from "./+types.bsl.js";

export interface BslGlobals {
  locks: Lock[];
  initialClientY: number;
  previousMarginRight: string | undefined;
  previousBodyOverflowSetting: string | undefined;
  htmlStyle:
    | {
        height: string;
        overflow: string;
      }
    | undefined;
  bodyStyle: BodyStyleType | undefined;

  documentListenerAdded: boolean;
  locksIndex: Map<any, number>;
}

export const bslGlobals: BslGlobals = {
  locks: [],
  initialClientY: -1,
  previousMarginRight: undefined,
  previousBodyOverflowSetting: undefined,
  htmlStyle: undefined,
  bodyStyle: undefined,
  locksIndex: new Map(),
  documentListenerAdded: false,
};
