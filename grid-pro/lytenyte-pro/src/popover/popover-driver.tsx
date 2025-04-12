import { useEffect, useState } from "react";
import { useGrid } from "../use-grid";
import { Popover as P } from "@base-ui-components/react/popover";
import { AnchorProvider } from "../anchor-context/anchor-context";

export function PopoverDriver() {
  const grid = useGrid();

  const frames = grid.state.popoverFrames.use();
  const frameId = grid.state.internal.popoverFrameOpen.use();
  const frameBB = grid.state.internal.popoverFrameBB.use();
  const frameContext = grid.state.internal.popoverFrameContext.use();
  const frame = frameId ? frames[frameId] : null;

  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!frame || !frameBB) {
      setOpen(false);
      return;
    }

    setOpen(true);
  }, [frame, frameBB]);

  return (
    <P.Root
      open={open}
      onOpenChange={(c) => setOpen(c)}
      onOpenChangeComplete={(c) => {
        if (!c) grid.api.popoverFrameClose();
      }}
    >
      <AnchorProvider anchor={frameBB}>
        <P.Portal>
          {frame && frameBB && (
            <frame.component api={grid.api} frame={frame} context={frameContext} />
          )}
        </P.Portal>
      </AnchorProvider>
    </P.Root>
  );
}
