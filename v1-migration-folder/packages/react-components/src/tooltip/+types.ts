import type { ReferenceElement } from "@1771technologies/lytenyte-floating";
import type { ReactElement } from "react";
import type { UsePositioner } from "../positioner/use-positioner.js";

export interface Tooltip {
  readonly id: string;
  readonly render: ReactElement | ((props: { ref?: any }) => ReactElement);
  readonly anchor: ReferenceElement;
  readonly interactive?: boolean;
  readonly tag?: string;
  readonly root?: HTMLElement;
  readonly position?: Omit<UsePositioner, "anchor" | "floating">;

  readonly hideDelay?: number;
  readonly showDelay?: number;
  readonly onShow?: () => void;
  readonly onHide?: () => void;
}
