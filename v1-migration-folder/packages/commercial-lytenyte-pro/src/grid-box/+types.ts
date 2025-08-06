import type { ReactNode } from "react";
import type { DropEventParams } from "../+types";

export interface GridBoxItem {
  readonly id: string;
  readonly label: string;
  readonly data: Record<string, any>;
  readonly draggable: boolean;
  readonly dragPlaceholder?: () => ReactNode;

  readonly onDrop: (p: DropEventParams) => void;
  readonly onAction: () => void;
}
