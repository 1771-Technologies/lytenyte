export function FallbackRenderer<T extends { id: string }>(item: T) {
  return <div>{item.id}</div>;
}
