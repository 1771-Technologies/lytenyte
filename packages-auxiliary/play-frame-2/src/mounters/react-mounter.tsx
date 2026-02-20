import { Suspense, use, useMemo } from "react";

export function ReactMounter({ filePath }: { filePath: string }) {
  const module = useMemo(() => {
    return import(/* @vite-ignore */ filePath);
  }, [filePath]);

  return (
    <Suspense>
      <Mount modPromise={module} />
    </Suspense>
  );
}

function Mount({ modPromise }: { modPromise: Promise<any> }) {
  const mod = use(modPromise);

  return <mod.default />;
}
