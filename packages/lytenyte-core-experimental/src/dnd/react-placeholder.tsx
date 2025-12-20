import { dragX, dragY, dragData } from "./global.js";
import type { ReactPlaceholderFn } from "./types.js";
import { useSelector } from "./signal.js";

export function ReactPlaceholder({
  Render,
  isDragging,
}: {
  Render: ReactPlaceholderFn;
  isDragging: boolean;
}) {
  if (!isDragging) return;

  return <ReactPlaceholderImpl Render={Render} />;
}

function ReactPlaceholderImpl({ Render }: { Render: ReactPlaceholderFn }) {
  const x = useSelector(dragX);
  const y = useSelector(dragY);
  const data = useSelector(dragData);

  if (!data) return null;

  return <Render data={data} y={y} x={x} />;
}
