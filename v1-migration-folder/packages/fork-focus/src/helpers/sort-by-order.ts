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
import type { CandidateScope } from "./get-candidates-iteratively.js";
import { getSortOrderTabIndex } from "./get-sort-order-tab-index.js";
import { sortOrderedTabbables } from "./sort-ordered-tabbables.js";

export const sortByOrder = function (candidates: (Element | CandidateScope)[]): Element[] {
  const regularTabbables: Element[] = [];
  const orderedTabbables: {
    documentOrder: number;
    tabIndex: number;
    item: CandidateScope | Element;
    isScope: boolean;
    content: (Element | CandidateScope)[];
  }[] = [];

  candidates.forEach(function (item, i) {
    const isScope = !!(item as CandidateScope).scopeParent;
    const element = isScope ? (item as CandidateScope).scopeParent : item;
    const candidateTabindex = getSortOrderTabIndex(element as HTMLElement, isScope);
    const elements = isScope ? sortByOrder((item as CandidateScope).candidates) : element;
    if (candidateTabindex === 0) {
      if (isScope) regularTabbables.push(...(elements as unknown as Element[]));
      else regularTabbables.push(element as Element);
    } else {
      orderedTabbables.push({
        documentOrder: i,
        tabIndex: candidateTabindex,
        item: item,
        isScope: isScope,
        content: elements as unknown as Element[],
      });
    }
  });

  return orderedTabbables
    .sort(sortOrderedTabbables)
    .reduce((acc, sortable) => {
      if (sortable.isScope) acc.push(...sortable.content);
      else acc.push(sortable.content);

      return acc;
    }, [] as any[])
    .concat(regularTabbables);
};
