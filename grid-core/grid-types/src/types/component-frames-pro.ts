import type { ApiPro } from "../export-pro";

export type PanelFrameComponentParams<A, E> = { api: A; frame: PanelFrame<A, E>; context?: any };
export type PanelFrameComponent<A, E> = (p: PanelFrameComponentParams<A, E>) => E;

export interface PanelFrame<A, E> {
  readonly title: string;
  readonly component: PanelFrameComponent<A, E>;
}

export type DialogFrameComponentParams<A, E> = { api: A; frame: DialogFrame<A, E>; context?: any };
export type DialogFrameComponent<A, E> = (p: DialogFrameComponentParams<A, E>) => E;
export interface DialogFrame<A, E> {
  readonly component: DialogFrameComponent<A, E>;
}

export type PopoverFrameComponentParams<A, E> = {
  api: A;
  frame: PopoverFrame<A, E>;
  context?: any;
};
export type PopoverFrameComponent<A, E> = (p: PopoverFrameComponentParams<A, E>) => E;
export interface PopoverFrame<A, E> {
  readonly component: PopoverFrameComponent<A, E>;
}

export type MenuFrameComponentParams<A, E> = { api: A; frame: MenuFrame<A, E>; context?: any };
export type MenuFrameComponent<A, E> = (p: MenuFrameComponentParams<A, E>) => E;
export interface MenuFrame<A, E> {
  readonly component: MenuFrameComponent<A, E>;
}

// additional
export type PanelFrameComponentParamsPro<D, E> = PanelFrameComponentParams<ApiPro<D, E>, E>;
export type PanelFrameComponentPro<D, E> = PanelFrameComponent<ApiPro<D, E>, E>;
export type PanelFramePro<D, E> = PanelFrame<ApiPro<D, E>, E>;

export type DialogFrameComponentParamsPro<D, E> = DialogFrameComponentParams<ApiPro<D, E>, E>;
export type DialogFrameComponentPro<D, E> = DialogFrameComponent<ApiPro<D, E>, E>;
export type DialogFramePro<D, E> = DialogFrame<ApiPro<D, E>, E>;

export type PopoverFrameComponentParamsPro<D, E> = PopoverFrameComponentParams<ApiPro<D, E>, E>;
export type PopoverFrameComponentPro<D, E> = PopoverFrameComponent<ApiPro<D, E>, E>;
export type PopoverFramePro<D, E> = PopoverFrame<ApiPro<D, E>, E>;

export type MenuFrameComponentParamsPro<D, E> = MenuFrameComponentParams<ApiPro<D, E>, E>;
export type MenuFrameComponentPro<D, E> = MenuFrameComponent<ApiPro<D, E>, E>;
export type MenuFramePro<D, E> = MenuFrame<ApiPro<D, E>, E>;
