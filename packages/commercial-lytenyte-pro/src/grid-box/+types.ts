import type { ReactNode } from "react";
import type { DropEventParams } from "../+types";

export interface GridBoxItem<T = any> {
  readonly id: string;
  readonly label: string;
  readonly data: T;
  readonly dragData: Record<string, any>;
  readonly draggable: boolean;
  readonly dragPlaceholder?: () => ReactNode;

  readonly onDrop: (p: DropEventParams) => void;
  readonly onAction: () => void;
  readonly onDelete: () => void;
}
