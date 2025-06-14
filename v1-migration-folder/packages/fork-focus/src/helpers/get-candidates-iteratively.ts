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
import { isInert, matches } from "@1771technologies/lytenyte-dom-utils";
import { CANDIDATE_SELECTOR } from "../+constants.focus.js";

export type ShadowRootFilter = (el: Element) => boolean;
export type CandidateScope = {
  readonly scopeParent: Element;
  readonly candidates: Element[];
};
export type InteractiveOptions = {
  readonly getShadowRoot?:
    | boolean
    | ((node: HTMLElement | SVGElement) => ShadowRoot | boolean | undefined);
  readonly filter: (node: Element) => boolean;
  readonly flatten: boolean;
  readonly shadowRootFilter: ShadowRootFilter;
};

export const getCandidatesIteratively = (
  elements: Element[],
  includeContainer: boolean,
  options: InteractiveOptions,
): (Element | CandidateScope)[] => {
  const candidates = [];
  const elementsToCheck = Array.from(elements);

  while (elementsToCheck.length) {
    const element = elementsToCheck.shift()!;
    if (isInert(element, false)) {
      // no need to look up since we're drilling down
      // anything inside this container will also be inert
      continue;
    }

    if (element.tagName === "SLOT") {
      // add shadow dom slot scope (slot itself cannot be focusable)
      const assigned = (element as HTMLSlotElement).assignedElements();
      const content = assigned.length ? assigned : element.children;
      const nestedCandidates = getCandidatesIteratively(content as Element[], true, options);
      if (options.flatten) {
        candidates.push(...nestedCandidates);
      } else {
        candidates.push({
          scopeParent: element,
          candidates: nestedCandidates,
        });
      }
    } else {
      // check candidate element
      const validCandidate = matches.call(element, CANDIDATE_SELECTOR);
      if (
        validCandidate &&
        options.filter(element) &&
        (includeContainer || !elements.includes(element))
      ) {
        candidates.push(element);
      }

      // iterate over shadow content if possible
      const shadowRoot =
        element.shadowRoot ||
        // check for an undisclosed shadow
        (typeof options.getShadowRoot === "function" &&
          options.getShadowRoot(element as HTMLElement));

      // no inert look up because we're already drilling down and checking for inertness
      //  on the way down, so all containers to this root node should have already been
      //  vetted as non-inert
      const validShadowRoot =
        !isInert(shadowRoot as unknown as HTMLElement, false) &&
        (!options.shadowRootFilter || options.shadowRootFilter(element));

      if (shadowRoot && validShadowRoot) {
        // add shadow dom scope IIF a shadow root node was given; otherwise, an undisclosed
        //  shadow exists, so look at light dom children as fallback BUT create a scope for any
        //  child candidates found because they're likely slotted elements (elements that are
        //  children of the web component element (which has the shadow), in the light dom, but
        //  slotted somewhere _inside_ the undisclosed shadow) -- the scope is created below,
        //  _after_ we return from this recursive call
        const nestedCandidates = getCandidatesIteratively(
          (shadowRoot === true
            ? element.children
            : shadowRoot.children) as unknown as HTMLElement[],
          true,
          options,
        );

        if (options.flatten) {
          candidates.push(...nestedCandidates);
        } else {
          candidates.push({
            scopeParent: element,
            candidates: nestedCandidates,
          });
        }
      } else {
        // there's not shadow so just dig into the element's (light dom) children
        //  __without__ giving the element special scope treatment
        elementsToCheck.unshift(...(element.children as unknown as any[]));
      }
    }
  }

  return candidates as (Element | CandidateScope)[];
};
