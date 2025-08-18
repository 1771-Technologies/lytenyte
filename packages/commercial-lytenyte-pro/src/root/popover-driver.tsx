import type { PopoverFrame } from "../+types";
import { useGridRoot } from "../context";

export function PopoverDriver() {
  const grid = useGridRoot().grid;

  const openFrameState = grid.internal.popoverFrames.useValue();
  const frames = grid.state.popoverFrames.useValue();

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
    .filter((c) => c) as PopoverFrame<any>[];

  return (
    <>
      {openFrames.map((frame, i) => {
        return (
          <frame.component
            key={frameIds[i]}
            frame={frame}
            grid={grid}
            context={openFrameState[frameIds[i]].context}
            target={openFrameState[frameIds[i]].target}
          />
        );
      })}
    </>
  );
}
