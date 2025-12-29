import type { Dimension, GroupFn, RowLeaf } from "@1771technologies/lytenyte-shared";
import { useMemo } from "react";
import { computeField } from "../root/hooks/use-api/auxiliary-functions/compute-field.js";

export function useGroupFn<T>(group: GroupFn<T> | Dimension<T>[] | null | undefined) {
  return useMemo<GroupFn<T> | null>(() => {
    if (!group) return null;
    if (!Array.isArray(group)) return group;

    const fn = (row: RowLeaf<T>) => {
      return group.map((x) => {
        const field = x.field ?? (x as any).id;
        return computeField(field, row) as string;
      });
    };

    return fn;
  }, [group]);
}
