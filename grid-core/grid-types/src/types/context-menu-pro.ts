import type { ApiPro } from "../export-pro";

export type ContextMenuGridTargets = "cell" | "header" | "header-group" | "header-floating";

export type ContextMenuRendererParams<A> = {
  readonly menuTarget: ContextMenuGridTargets;
  readonly api: A;
  readonly columnIndex?: number | null;
  readonly rowIndex?: number | null;
};

export type ContextMenuRenderer<A, E> = (p: ContextMenuRendererParams<A>) => E;
export type ContextMenuPredicate<A> = (p: ContextMenuRendererParams<A>) => boolean;

export type Target = HTMLElement | { x: number; y: number; width: number; height: number };

// Additional

export type ContextMenuGridTargetsPro = ContextMenuGridTargets;
export type ContextMenuRendererParamsPro<D, E> = ContextMenuRendererParams<ApiPro<D, E>>;
export type ContextMenuRendererPro<D, E> = ContextMenuRenderer<ApiPro<D, E>, E>;
export type ContextMenuPredicatePro<D, E> = ContextMenuPredicate<ApiPro<D, E>>;
export type TargetPro = Target;
