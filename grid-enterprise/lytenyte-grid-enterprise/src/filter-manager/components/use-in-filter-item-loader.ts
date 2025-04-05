import { useCallback, useEffect, useState } from "react";
import type { ColumnInFilterItem } from "@1771technologies/grid-types/pro";

export function useInFilterItemLoader(
  getTreeFilterItems: () => Promise<ColumnInFilterItem[]> | ColumnInFilterItem[],
) {
  const [treeFilterItems, setTreeFilterItems] = useState<ColumnInFilterItem[]>([]);
  const [hasError, setError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const loadItems = useCallback(() => {
    if (!getTreeFilterItems) return [];
    const items = getTreeFilterItems();

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
  }, [getTreeFilterItems]);

  useEffect(() => {
    loadItems();
  }, [loadItems]);

  return { isLoading, hasError, treeFilterItems, retry: loadItems };
}
