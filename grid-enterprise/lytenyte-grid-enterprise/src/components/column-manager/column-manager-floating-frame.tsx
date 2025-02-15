import { ColumnManager } from "@1771technologies/grid-components";
import type { FloatingFrameReact } from "@1771technologies/grid-types/enterprise-react";

export const columnManagerFloatingFrame: FloatingFrameReact<any> = {
  title: "Column Manager",
  component: (p) => <ColumnManager api={p.api} />,
  w: 800,
  h: 800,
};
