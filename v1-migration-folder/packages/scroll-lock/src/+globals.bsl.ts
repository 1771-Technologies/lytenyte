import type { BodyStyleType, Lock } from "./+types.bsl.js";

export interface BslGlobals {
  locks: Lock[];
  initialClientY: number;
  previousMarginRight: string | undefined;
  previousBodyOverflowSetting: string | undefined;
  htmlStyle:
    | {
        height: string;
        overflow: string;
      }
    | undefined;
  bodyStyle: BodyStyleType | undefined;

  documentListenerAdded: boolean;
  locksIndex: Map<any, number>;
}

export const bslGlobals: BslGlobals = {
  locks: [],
  initialClientY: -1,
  previousMarginRight: undefined,
  previousBodyOverflowSetting: undefined,
  htmlStyle: undefined,
  bodyStyle: undefined,
  locksIndex: new Map(),
  documentListenerAdded: false,
};
