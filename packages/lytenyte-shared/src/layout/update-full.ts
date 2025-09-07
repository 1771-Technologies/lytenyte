import { updateLayout, type UpdateLayoutArgs } from "./update-layout.js";

export function updateFull(args: UpdateLayoutArgs): {
  current: ReturnType<typeof setTimeout> | null;
} {
  updateLayout(args);

  const timeoutRef: { current: ReturnType<typeof setTimeout> | null } = { current: null };

  let position = args.topCount;

  function runSelf() {
    if (position >= args.rowMax) {
      timeoutRef.current = null;
      return;
    }

    timeoutRef.current = setTimeout(() => {
      const next = { ...args, rowStart: position, rowEnd: Math.min(position + 10000, args.rowMax) };

      position += 10000;
      updateLayout(next);

      runSelf();
    }, 4);
  }

  runSelf();
  return timeoutRef;
}
