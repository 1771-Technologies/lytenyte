import { useEffect, useState, type PropsWithChildren } from "react";

export function Resetter(props: PropsWithChildren) {
  const [el, setEl] = useState<HTMLElement | null>(null);
  const [key, setKey] = useState(0);

  useEffect(() => {
    if (!el) return;

    const controller = new AbortController();
    el.addEventListener(
      "ln-reset",
      () => {
        setKey((prev) => prev + 1);
      },
      { signal: controller.signal },
    );

    return () => controller.abort();
  }, [el]);

  return (
    <div ref={setEl} className="h-full w-full" key={key}>
      {props.children}
    </div>
  );
}
