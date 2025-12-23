import { useProRoot } from "../root/context.js";
import type { PopoverFrame } from "../types/grid.js";

export function PopoverDriver() {
  const { openPopoverFrames: openFrameState, api, popoverFrames: frames } = useProRoot();

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
    .filter((c) => c) as PopoverFrame[];

  return (
    <>
      {openFrames.map((frame, i) => {
        return (
          <frame.component
            key={frameIds[i]}
            frame={frame}
            api={api}
            context={openFrameState[frameIds[i]].context}
            target={openFrameState[frameIds[i]].target}
          />
        );
      })}
    </>
  );
}
