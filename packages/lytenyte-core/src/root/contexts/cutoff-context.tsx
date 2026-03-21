import { createContext, useContext } from "react";

export interface CutoffType {
  readonly rowCount: number;
  readonly topCount: number;
  readonly centerCount: number;
  readonly bottomCount: number;
  readonly startCount: number;
  readonly endCount: number;
  readonly colCenterCount: number;

  readonly topCutoff: number;
  readonly bottomCutoff: number;
  readonly startCutoff: number;
  readonly endCutoff: number;
}

const context = createContext<CutoffType>({} as any);

export const CutoffProvider = context.Provider;
export const useCutoffs = () => useContext(context);
