import type { RootCellFn } from "../../../../lytenyte-shared/src/+types.non-gen";

interface Event {
  readonly key: string;
  readonly preventDefault: () => void;
  readonly stopPropagation: () => void;
  readonly ctrlKey: boolean;
  readonly metaKey: boolean;
}

interface HandleNavigationArgs {
  readonly event: Event;
  readonly getRootCell: RootCellFn;
}

export function handleNavigation({ event: e }: HandleNavigationArgs) {
  const keys = ["ArrowRight", "ArrowLeft"];

  // If pressed key is not in the included navigation keys, then we can simply ignore the
  // key being pressed.
  if (!keys.includes(e.key)) return;

  // This key is going to have an action. Since it will have an actions we prevent it
  // and stop the propagation any further. This function should be attached to the viewport,
  // hence it should still allow elements within the grid to handle keys.
  e.preventDefault();
  e.stopPropagation();

  // We need to know what our current focus position.
}
