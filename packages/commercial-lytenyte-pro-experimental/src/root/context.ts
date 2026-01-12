import { createContext, useContext, type Dispatch, type RefObject, type SetStateAction } from "react";
import type { API, DataRect, DataRectSplit, Props, VirtualTarget } from "../types";

export interface ProContext {
  readonly api: API;

  readonly openDialogFrames: Record<string, any>;
  readonly setDialogFrames: Dispatch<SetStateAction<Record<string, any>>>;
  readonly openPopoverFrames: Record<string, { target: HTMLElement | VirtualTarget; context: any }>;
  readonly setPopoverFrames: Dispatch<
    SetStateAction<Record<string, { target: HTMLElement | VirtualTarget; context: any }>>
  >;
  readonly dialogFrames: Required<Props>["dialogFrames"];
  readonly popoverFrames: Required<Props>["popoverFrames"];

  readonly excludeMarker: boolean;
  readonly keepSelection: boolean;

  readonly cellSelections: DataRect[];
  readonly onCellSelectionChange: (rect: DataRect[]) => void;
  readonly cellSelectionMode: "range" | "multi-range" | "none";

  readonly cellSelectionAdditiveRects: DataRectSplit[] | null;
  readonly setCellSelectionAdditiveRects: Dispatch<SetStateAction<DataRectSplit[] | null>>;
  readonly cellSelectionIsDeselect: RefObject<boolean>;

  readonly cellSelectionSplits: DataRectSplit[];
}

const context = createContext({} as ProContext);

export const ProRootProvider = context.Provider;
export const useProRoot = () => useContext(context);
