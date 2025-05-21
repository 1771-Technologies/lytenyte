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
