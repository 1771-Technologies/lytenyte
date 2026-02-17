import { dragX, dragY, dragData } from "./global.js";
import type { ReactPlaceholderFn } from "./types.js";
import { useSelector } from "../signal/signal.js";
import { useEffect, useState } from "react";

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

  const [mount, setMount] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      setMount(true);
    }, 100);
  }, []);

  if (!data || !mount) return null;

  return <Render data={data} y={y} x={x} />;
}
