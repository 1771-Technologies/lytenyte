export interface RectReadOnly {
  readonly x: number;
  readonly y: number;
  readonly width: number;
  readonly height: number;
  readonly top: number;
  readonly right: number;
  readonly bottom: number;
  readonly left: number;
}

export type HTMLOrSVGElement = HTMLElement | SVGElement;

export type UseMeasureResult = [
  (element: HTMLOrSVGElement | null) => void,
  RectReadOnly,
  () => void,
  HTMLOrSVGElement | null,
];

export type UseMeasureState = {
  element: HTMLOrSVGElement | null;
  scrollContainers: HTMLOrSVGElement[] | null;
  resizeObserver: ResizeObserver | null;
  lastBounds: RectReadOnly;
  orientationHandler: null | (() => void);
};

export type UseMeasureOptions = {
  debounce?: number | { scroll: number; resize: number };
  scroll?: boolean;
  offsetSize?: boolean;
  onChange?: (next: RectReadOnly, prev: RectReadOnly) => void;
};
