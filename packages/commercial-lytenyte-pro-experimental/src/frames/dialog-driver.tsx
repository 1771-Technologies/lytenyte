import { useProRoot } from "../root/context.js";
import type { DialogFrame } from "../types/grid.js";

export function DialogDriver() {
  const { openDialogFrames, dialogFrames: frames, api } = useProRoot();

  const frameIds = Object.keys(openDialogFrames);
  const openFrames = frameIds
    .map((c) => {
      const frame = frames[c];
      if (!frame) {
        console.error(`Failed to find a dialog frame with id ${c}`);
        return null;
      }

      return frame;
    })
    .filter((c) => c) as DialogFrame[];

  return (
    <>
      {openFrames.map((frame, i) => {
        return (
          <frame.component
            key={frameIds[i]}
            frame={frame}
            api={api}
            context={openDialogFrames[frameIds[i]]}
          />
        );
      })}
    </>
  );
}
