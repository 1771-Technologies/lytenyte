import type { ApiPro } from "../export-pro";

export type OverlayId =
  | "lng1771-loading-overlay"
  | "lng1771-no-data-overlay"
  | "lng1771-load-error-overlay"
  | (string & {});

export type OverlayRendererParams<A> = {
  readonly api: A;
};

export interface Overlay<A, E> {
  readonly renderer: (p: OverlayRendererParams<A>) => E;
  readonly overRows?: boolean;
}

export type Overlays<A, E> = {
  [id: string]: Overlay<A, E>;
};

// Additional
export type OverlayIdPro = OverlayId;
export type OverlayRendererParamsPro<D, E> = OverlayRendererParams<ApiPro<D, E>>;
export type OverlayPro<D, E> = Overlay<ApiPro<D, E>, E>;
export type OverlaysPro<D, E> = Overlays<ApiPro<D, E>, E>;
