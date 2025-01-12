import type { ReactNode } from "react";
import type { Api } from "./make-grid-enterprise";
import type { FloatingFrame as FF, PanelFrame } from "./types-enterprise";

export type FloatingFrameReact<D> = FF<Api<D, ReactNode>, ReactNode>;
export type PanelFrameReact<D> = PanelFrame<Api<D, ReactNode>, ReactNode>;
