import { Frame, type FrameAxeProps } from "@1771technologies/react-frame";
import { useGrid } from "../provider/grid-provider";
import { cc } from "../component-configuration";

export interface FloatingFrameConfiguration {
  axe: FrameAxeProps;
}

export const FloatingFrameDriver = () => {
  const grid = useGrid();
  const frameId = grid.state.internal.floatingFrameOpen.use();

  if (!frameId) return;

  return <FloatingFrameImpl frameId={frameId} />;
};

function FloatingFrameImpl({ frameId }: { frameId: string }) {
  const grid = useGrid();
  const axe = cc.floatingFrame.use().axe;

  const frame = grid.state.floatingFrames.use()[frameId];

  const Component = frame.component;

  return (
    <Frame
      show
      onShowChange={() => grid.api.floatingFrameClose()}
      axe={axe}
      x={frame.x ?? 500}
      y={frame.h ?? 500}
    >
      <div></div>
      <Component api={grid.api} frame={frame} />
    </Frame>
  );
}
