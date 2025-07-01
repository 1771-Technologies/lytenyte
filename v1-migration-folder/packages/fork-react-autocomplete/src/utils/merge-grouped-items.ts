export interface GroupedItemsProps<G, T> {
  groups: G[] | { [s: string]: T[] } | ArrayLike<T[]>;
  getItemsInGroup?: (group: G) => T[];
}

const isArray = Array.isArray;

const mergeGroupedItems = <G, T>({ groups, getItemsInGroup }: GroupedItemsProps<G, T>): T[] => {
  const groupArray = isArray(groups) ? groups : Object.values(groups);
  return groupArray.reduce<T[]>(
    (accu, group) =>
      accu.concat(isArray(group) ? group : getItemsInGroup ? getItemsInGroup(group) : []),
    [],
  );
};

export { mergeGroupedItems };
