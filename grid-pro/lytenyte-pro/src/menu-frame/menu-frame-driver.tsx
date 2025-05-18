import { useEffect, useState } from "react";
import { useGrid } from "../use-grid";
import { Menu as M } from "@base-ui-components/react/menu";
import { AnchorProvider } from "../anchor-context/anchor-context";

export function MenuFrameDriver() {
  const grid = useGrid();

  const frames = grid.state.menuFrames.use();
  const frameId = grid.state.internal.menuFrameOpen.use();
  const frameBB = grid.state.internal.menuFrameBB.use();
  const context = grid.state.internal.menuFrameContext.use();
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
    <M.Root
      open={open}
      onOpenChange={(c) => setOpen(c)}
      onOpenChangeComplete={(c) => {
        if (!c) grid.api.menuFrameClose();
      }}
    >
      <AnchorProvider anchor={frameBB}>
        <M.Portal>
          {frame && frameBB && <frame.component api={grid.api} frame={frame} context={context} />}
        </M.Portal>
      </AnchorProvider>
    </M.Root>
  );
}
