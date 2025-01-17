import type { ApiEnterpriseReact, ColumnEnterpriseReact } from "@1771technologies/grid-types";
import { useCallback, useEffect, useState } from "react";
import type { FilterContainerProps } from "../filter-container/filter-container";
import type { ColumnInFilterItem } from "@1771technologies/grid-types/enterprise";

export function useInFilterItemLoader<D>(
  api: ApiEnterpriseReact<D>,
  column: ColumnEnterpriseReact<D>,
  getTreeFilterItems?: Required<FilterContainerProps<D>>["getTreeFilterItems"],
) {
  const [treeFilterItems, setTreeFilterItems] = useState<ColumnInFilterItem[]>([]);
  const [hasError, setError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const loadItems = useCallback(() => {
    if (!getTreeFilterItems) return [];
    const items = getTreeFilterItems(api, column);

    if ("then" in items) {
      setIsLoading(true);

      items
        .then((res) => {
          setTreeFilterItems(res);
        })
        .catch((error) => {
          console.error(error);
          setError(true);
        })
        .finally(() => {
          setIsLoading(false);
        });
    } else {
      setTreeFilterItems(items);
    }
  }, [api, column, getTreeFilterItems]);

  useEffect(() => {
    loadItems();
  }, [loadItems]);

  return { isLoading, hasError, treeFilterItems, retry: loadItems };
}
