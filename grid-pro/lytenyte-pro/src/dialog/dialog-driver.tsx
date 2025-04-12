import { useEffect, useState } from "react";
import { useGrid } from "../use-grid";
import { Dialog } from "@base-ui-components/react/dialog";

export function DialogDriver() {
  const grid = useGrid();

  const frames = grid.state.dialogFrames.use();
  const frameId = grid.state.internal.dialogFrameOpen.use();
  const context = grid.state.internal.dialogFrameContext.use();
  const frame = frameId ? frames[frameId] : null;

  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!frame) {
      setOpen(false);
      return;
    }

    setOpen(true);
  }, [frame]);

  return (
    <Dialog.Root
      open={open}
      onOpenChange={(c) => setOpen(c)}
      onOpenChangeComplete={(c) => {
        if (!c) grid.api.dialogFrameClose();
      }}
    >
      <Dialog.Portal>
        {frame && <frame.component api={grid.api} frame={frame} context={context} />}
      </Dialog.Portal>
    </Dialog.Root>
  );
}
