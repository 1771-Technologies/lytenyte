import type { ApiPro } from "../export-pro";

export interface PanelFrame<A, E> {
  readonly title: string;
  readonly component: (p: { api: A; frame: PanelFrame<A, E> }) => E;
}

export interface DialogFrame<A, E> {
  readonly component: (p: { api: A; frame: DialogFrame<A, E> }) => E;
}
export interface PopoverFrame<A, E> {
  readonly component: (p: { api: A; frame: PopoverFrame<A, E> }) => E;
}

// additional
export type PanelFramePro<D, E> = PanelFrame<ApiPro<D, E>, E>;
export type DialogFramePro<D, E> = DialogFrame<ApiPro<D, E>, E>;
export type PopoverFramePro<D, E> = PopoverFrame<ApiPro<D, E>, E>;
