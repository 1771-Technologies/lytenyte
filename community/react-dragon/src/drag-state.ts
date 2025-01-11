import { cascada, signal } from "@1771technologies/react-cascada";

/**
 * Creates a global drag and drop state manager using Cascada.
 * This state tracks the active drag operation, associated tags, and drag data.
 *
 * @returns An object containing the following signals:
 * - dragActive: Indicates if a drag operation is currently active
 * - activeTags: Array of tags associated with the dragged item
 * - dragData: Function that returns the data being dragged
 * - overTags: Array of tags associated with the element being dragged over
 */
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
