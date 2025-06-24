import type { PathTableItem } from "../path";

export interface Item {
  readonly id: string;
  readonly hide?: boolean;
  readonly pin?: "start" | "end" | null;
  readonly groupPath?: string[];
  readonly groupVisibility?: "always" | "close" | "open";
}

export interface Base {
  hide?: boolean;
}

export interface TableView {
  readonly maxCol: number;
  readonly maxRow: number;
  readonly view: PathTableItem<Item>[][];
}
