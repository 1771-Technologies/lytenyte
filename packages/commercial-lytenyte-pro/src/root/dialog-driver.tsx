import type { DialogFrame } from "../+types";
import { useGridRoot } from "../context.js";

export function DialogDriver() {
  const grid = useGridRoot().grid;

  const openFrameState = grid.internal.dialogFrames.useValue();
  const frames = grid.state.dialogFrames.useValue();

  const frameIds = Object.keys(openFrameState);
  const openFrames = frameIds
    .map((c) => {
      const frame = frames[c];
      if (!frame) {
        console.error(`Failed to find a dialog frame with id ${c}`);
        return null;
      }

      return frame;
    })
    .filter((c) => c) as DialogFrame<any>[];

  return (
    <>
      {openFrames.map((frame, i) => {
        return (
          <frame.component
            key={frameIds[i]}
            frame={frame}
            grid={grid}
            context={openFrameState[frameIds[i]]}
          />
        );
      })}
    </>
  );
}
