import { useId, type PropsWithChildren } from "react";
import { Dialog } from "../../dialog/dialog.js";
import type { RootProps } from "../../dialog/root.js";
import { idContext } from "./id-context.js";

export const Root = (props: PropsWithChildren<RootProps>) => {
  const anchorId = useId();
  return (
    <idContext.Provider value={anchorId}>
      <Dialog.Root anchor={`#${anchorId}`} {...props}></Dialog.Root>
    </idContext.Provider>
  );
};
