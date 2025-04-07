import type { ApiCore } from "@1771technologies/grid-types/core";
import type { ApiPro } from "@1771technologies/grid-types/pro";

export const rowUpdateRedo = <D, E>(api: ApiCore<D, E> | ApiPro<D, E>) => {
  const s = api.getState();
  if (!s.rowUpdateStackEnabled.peek()) return;

  const pointer = s.internal.rowUpdateStackPointer.peek();
  const stack = s.internal.rowUpdateStack.peek();

  if (pointer >= stack.length - 1) return;

  const update = stack[pointer + 1];

  if (!update) return;

  s.internal.rowUpdateStackPointer.set(pointer + 1);
  s.internal.rowBackingDataSource.peek().rowSetDataMany(update.redo);
};

export const rowUpdateUndo = <D, E>(api: ApiCore<D, E> | ApiPro<D, E>) => {
  const s = api.getState();
  if (!s.rowUpdateStackEnabled.peek()) return;

  const pointer = s.internal.rowUpdateStackPointer.peek();
  const stack = s.internal.rowUpdateStack.peek();

  if (pointer < 0 || stack.length === 0) return;

  const update = stack[pointer];

  s.internal.rowUpdateStackPointer.set(pointer - 1);
  s.internal.rowBackingDataSource.peek().rowSetDataMany(update.undo);
};
