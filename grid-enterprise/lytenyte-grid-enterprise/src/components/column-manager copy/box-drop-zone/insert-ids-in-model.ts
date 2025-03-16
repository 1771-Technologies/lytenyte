export function insertIdsIntoModel(model: string[], ids: string[], index: number) {
  const left = model.slice(0, index).filter((c) => !ids.includes(c));
  const right = model.slice(index).filter((c) => !ids.includes(c));

  const newModel = [...left, ...ids, ...right];

  return newModel;
}
