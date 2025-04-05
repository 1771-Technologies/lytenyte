import type {
  ApiCommunity,
  ApiEnterprise,
  ColumnCommunity,
  ColumnEnterprise,
} from "@1771technologies/grid-types";
import type {
  SortCycleOption,
  SortModelItem,
  SortOptions,
  Writable,
} from "@1771technologies/grid-types/core";

export const columnSortCycleToNext = <D, E>(
  api: ApiEnterprise<D, E> | ApiCommunity<D, E>,
  c: ColumnCommunity<D, E> | ColumnEnterprise<D, E>,
  isAdditive: boolean = false,
) => {
  api = api as ApiCommunity<D, E>;
  c = c as ColumnCommunity<D, E>;

  if (!api.columnIsSortable(c)) return;

  const s = api.getState();

  const nextSort = api.columnSortGetNext(c);

  const model = s.sortModel.peek();
  // If the next model is null we are removing it. This potentially means we will need to adjust
  // some of the configuration in some way.
  if (nextSort == null) {
    const modelIndex = api.columnSortModelIndex(c);
    if (modelIndex === -1) return;

    const nextModel = model.filter((_, i) => i !== modelIndex);
    s.sortModel.set(nextModel);

    return;
  }

  const modelItem = getSortFromSortOptionValue(nextSort, c.id);
  if (isAdditive) {
    const modelIndex = api.columnSortModelIndex(c);
    const nextModel = [...model];
    if (modelIndex === -1) {
      nextModel.push(modelItem);
      s.sortModel.set(nextModel);
      return;
    }

    nextModel[modelIndex] = modelItem;
    s.sortModel.set(nextModel);
    return;
  }

  s.sortModel.set([modelItem]);
};

function getSortFromSortOptionValue(
  option: NonNullable<SortCycleOption>,
  columnId: string,
): SortModelItem {
  const parts = option.split("_");

  const isDesc = parts[0] === "desc";

  const sort = {
    columnId,
    isDescending: isDesc,
    options: {} as Writable<SortOptions>,
  };

  for (let i = 1; i < parts.length; i++) {
    const part = parts[i];
    if (part === "accented") sort.options.isAccented = true;
    if (part === "abs") sort.options.isAbsolute = true;
    if (part === "nulls-first") sort.options.nullsAppearFirst = true;
  }

  return sort satisfies SortModelItem;
}
