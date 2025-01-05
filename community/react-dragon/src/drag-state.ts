import { cascada, signal } from "@1771technologies/react-cascada";

export const dragState = cascada(() => {
  const dragActive = signal(false);
  const activeTags = signal<string[] | null>(null);
  const dragData = signal<() => unknown>(() => null);
  const overTags = signal<string[] | null>(null);

  return {
    dragActive,
    activeTags,
    dragData,
    overTags,
  };
});
