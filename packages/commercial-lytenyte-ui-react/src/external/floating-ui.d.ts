//#region node_modules/.pnpm/@floating-ui+utils@0.2.10/node_modules/@floating-ui/utils/dist/floating-ui.utils.d.mts
declare type AlignedPlacement = `${Side}-${Alignment}`;
declare type Alignment = "start" | "end";
declare type Axis = "x" | "y";
declare type ClientRectObject = Prettify$1<Rect & SideObject>;
declare type Coords = { [key in Axis]: number };
declare type Dimensions = { [key in Length]: number };
declare interface ElementRects {
  reference: Rect;
  floating: Rect;
}
declare type Length = "width" | "height";
declare type Padding = number | Prettify$1<Partial<SideObject>>;
declare type Placement = Prettify$1<Side | AlignedPlacement>;
declare type Prettify$1<T> = { [K in keyof T]: T[K] } & {};
declare type Rect = Prettify$1<Coords & Dimensions>;
declare type Side = "top" | "right" | "bottom" | "left";
declare type SideObject = { [key in Side]: number };
declare type Strategy = "absolute" | "fixed";
//#endregion
//#region node_modules/.pnpm/@floating-ui+core@1.7.3/node_modules/@floating-ui/core/dist/floating-ui.core.d.mts
declare interface ArrowOptions$1 {
  /**
   * The arrow element to be positioned.
   * @default undefined
   */
  element: any;
  /**
   * The padding between the arrow element and the floating element edges.
   * Useful when the floating element has rounded corners.
   * @default 0
   */
  padding?: Padding;
}
declare interface AutoPlacementOptions$1 extends DetectOverflowOptions$1 {
  /**
   * The axis that runs along the alignment of the floating element. Determines
   * whether to check for most space along this axis.
   * @default false
   */
  crossAxis?: boolean;
  /**
   * Choose placements with a particular alignment.
   * @default undefined
   */
  alignment?: Alignment | null;
  /**
   * Whether to choose placements with the opposite alignment if the preferred
   * alignment does not fit.
   * @default true
   */
  autoAlignment?: boolean;
  /**
   * Which placements are allowed to be chosen. Placements must be within the
   * `alignment` option if explicitly set.
   * @default allPlacements (variable)
   */
  allowedPlacements?: Array<Placement>;
}
declare type Boundary$1 = any;
declare interface ComputePositionConfig$1 {
  /**
   * Object to interface with the current platform.
   */
  platform: Platform$1;
  /**
   * Where to place the floating element relative to the reference element.
   */
  placement?: Placement;
  /**
   * The strategy to use when positioning the floating element.
   */
  strategy?: Strategy;
  /**
   * Array of middleware objects to modify the positioning or provide data for
   * rendering.
   */
  middleware?: Array<Middleware$1 | null | undefined | false>;
}
declare interface ComputePositionReturn extends Coords {
  /**
   * The final chosen placement of the floating element.
   */
  placement: Placement;
  /**
   * The strategy used to position the floating element.
   */
  strategy: Strategy;
  /**
   * Object containing data returned from all middleware, keyed by their name.
   */
  middlewareData: MiddlewareData;
}
/**
 * Function option to derive middleware options from state.
 */
declare type Derivable$1<T> = (state: MiddlewareState$1) => T;
declare interface DetectOverflowOptions$1 {
  /**
   * The clipping element(s) or area in which overflow will be checked.
   * @default 'clippingAncestors'
   */
  boundary?: Boundary$1;
  /**
   * The root clipping area in which overflow will be checked.
   * @default 'viewport'
   */
  rootBoundary?: RootBoundary;
  /**
   * The element in which overflow is being checked relative to a boundary.
   * @default 'floating'
   */
  elementContext?: ElementContext;
  /**
   * Whether to check for overflow using the alternate element's boundary
   * (`clippingAncestors` boundary only).
   * @default false
   */
  altBoundary?: boolean;
  /**
   * Virtual padding for the resolved overflow detection offsets.
   * @default 0
   */
  padding?: Padding;
}
declare type ElementContext = "reference" | "floating";
declare interface Elements$1 {
  reference: ReferenceElement$1;
  floating: FloatingElement$1;
}
declare interface FlipOptions$1 extends DetectOverflowOptions$1 {
  /**
   * The axis that runs along the side of the floating element. Determines
   * whether overflow along this axis is checked to perform a flip.
   * @default true
   */
  mainAxis?: boolean;
  /**
   * The axis that runs along the alignment of the floating element. Determines
   * whether overflow along this axis is checked to perform a flip.
   * - `true`: Whether to check cross axis overflow for both side and alignment flipping.
   * - `false`: Whether to disable all cross axis overflow checking.
   * - `'alignment'`: Whether to check cross axis overflow for alignment flipping only.
   * @default true
   */
  crossAxis?: boolean | "alignment";
  /**
   * Placements to try sequentially if the preferred `placement` does not fit.
   * @default [oppositePlacement] (computed)
   */
  fallbackPlacements?: Array<Placement>;
  /**
   * What strategy to use when no placements fit.
   * @default 'bestFit'
   */
  fallbackStrategy?: "bestFit" | "initialPlacement";
  /**
   * Whether to allow fallback to the perpendicular axis of the preferred
   * placement, and if so, which side direction along the axis to prefer.
   * @default 'none' (disallow fallback)
   */
  fallbackAxisSideDirection?: "none" | "start" | "end";
  /**
   * Whether to flip to placements with the opposite alignment if they fit
   * better.
   * @default true
   */
  flipAlignment?: boolean;
}
declare type FloatingElement$1 = any;
declare interface HideOptions$1 extends DetectOverflowOptions$1 {
  /**
   * The strategy used to determine when to hide the floating element.
   */
  strategy?: "referenceHidden" | "escaped";
}
declare interface InlineOptions {
  /**
   * Viewport-relative `x` coordinate to choose a `ClientRect`.
   * @default undefined
   */
  x?: number;
  /**
   * Viewport-relative `y` coordinate to choose a `ClientRect`.
   * @default undefined
   */
  y?: number;
  /**
   * Represents the padding around a disjoined rect when choosing it.
   * @default 2
   */
  padding?: Padding;
}
declare type LimitShiftOffset =
  | number
  | {
      /**
       * Offset the limiting of the axis that runs along the alignment of the
       * floating element.
       */
      mainAxis?: number;
      /**
       * Offset the limiting of the axis that runs along the side of the
       * floating element.
       */
      crossAxis?: number;
    };
declare interface LimitShiftOptions {
  /**
   * Offset when limiting starts. `0` will limit when the opposite edges of the
   * reference and floating elements are aligned.
   * - positive = start limiting earlier
   * - negative = start limiting later
   */
  offset?: LimitShiftOffset | Derivable$1<LimitShiftOffset>;
  /**
   * Whether to limit the axis that runs along the alignment of the floating
   * element.
   */
  mainAxis?: boolean;
  /**
   * Whether to limit the axis that runs along the side of the floating element.
   */
  crossAxis?: boolean;
}
declare type Middleware$1 = {
  name: string;
  options?: any;
  fn: (state: MiddlewareState$1) => Promisable$1<MiddlewareReturn>;
};
declare interface MiddlewareData {
  [key: string]: any;
  arrow?: Partial<Coords> & {
    centerOffset: number;
    alignmentOffset?: number;
  };
  autoPlacement?: {
    index?: number;
    overflows: Array<{
      placement: Placement;
      overflows: Array<number>;
    }>;
  };
  flip?: {
    index?: number;
    overflows: Array<{
      placement: Placement;
      overflows: Array<number>;
    }>;
  };
  hide?: {
    referenceHidden?: boolean;
    escaped?: boolean;
    referenceHiddenOffsets?: SideObject;
    escapedOffsets?: SideObject;
  };
  offset?: Coords & {
    placement: Placement;
  };
  shift?: Coords & {
    enabled: { [key in Axis]: boolean };
  };
}
declare interface MiddlewareReturn extends Partial<Coords> {
  data?: {
    [key: string]: any;
  };
  reset?:
    | boolean
    | {
        placement?: Placement;
        rects?: boolean | ElementRects;
      };
}
declare interface MiddlewareState$1 extends Coords {
  initialPlacement: Placement;
  placement: Placement;
  strategy: Strategy;
  middlewareData: MiddlewareData;
  elements: Elements$1;
  rects: ElementRects;
  platform: Platform$1;
}
/**
 * Platform interface methods to work with the current platform.
 * @see https://floating-ui.com/docs/platform
 */
declare interface Platform$1 {
  getElementRects: (args: {
    reference: ReferenceElement$1;
    floating: FloatingElement$1;
    strategy: Strategy;
  }) => Promisable$1<ElementRects>;
  getClippingRect: (args: {
    element: any;
    boundary: Boundary$1;
    rootBoundary: RootBoundary;
    strategy: Strategy;
  }) => Promisable$1<Rect>;
  getDimensions: (element: any) => Promisable$1<Dimensions>;
  convertOffsetParentRelativeRectToViewportRelativeRect?: (args: {
    elements?: Elements$1;
    rect: Rect;
    offsetParent: any;
    strategy: Strategy;
  }) => Promisable$1<Rect>;
  getOffsetParent?: (element: any) => Promisable$1<any>;
  isElement?: (value: any) => Promisable$1<boolean>;
  getDocumentElement?: (element: any) => Promisable$1<any>;
  getClientRects?: (element: any) => Promisable$1<Array<ClientRectObject>>;
  isRTL?: (element: any) => Promisable$1<boolean>;
  getScale?: (element: any) => Promisable$1<{
    x: number;
    y: number;
  }>;
}
declare type Promisable$1<T> = T | Promise<T>;
declare type ReferenceElement$1 = any;
declare type RootBoundary = "viewport" | "document" | Rect;
declare interface ShiftOptions$1 extends DetectOverflowOptions$1 {
  /**
   * The axis that runs along the alignment of the floating element. Determines
   * whether overflow along this axis is checked to perform shifting.
   * @default true
   */
  mainAxis?: boolean;
  /**
   * The axis that runs along the side of the floating element. Determines
   * whether overflow along this axis is checked to perform shifting.
   * @default false
   */
  crossAxis?: boolean;
  /**
   * Accepts a function that limits the shifting done in order to prevent
   * detachment.
   */
  limiter?: {
    fn: (state: MiddlewareState$1) => Coords;
    options?: any;
  };
}
declare interface SizeOptions$1 extends DetectOverflowOptions$1 {
  /**
   * Function that is called to perform style mutations to the floating element
   * to change its size.
   * @default undefined
   */
  apply?(
    args: MiddlewareState$1 & {
      availableWidth: number;
      availableHeight: number;
    }
  ): void | Promise<void>;
}
//#endregion
//#region node_modules/.pnpm/@floating-ui+utils@0.2.10/node_modules/@floating-ui/utils/dist/floating-ui.utils.dom.d.mts
declare function getOverflowAncestors(
  node: Node,
  list?: OverflowAncestors,
  traverseIframes?: boolean
): OverflowAncestors;
declare type OverflowAncestors = Array<Element | Window | VisualViewport>;
//#endregion
//#region node_modules/.pnpm/@floating-ui+dom@1.7.4/node_modules/@floating-ui/dom/dist/floating-ui.dom.d.mts
/**
 * Provides data to position an inner element of the floating element so that it
 * appears centered to the reference element.
 * @see https://floating-ui.com/docs/arrow
 */
declare const arrow: (
  options: ArrowOptions | Derivable<ArrowOptions>
) => Middleware;
declare type ArrowOptions = Prettify<
  Omit<ArrowOptions$1, "element"> & {
    element: Element;
  }
>;
/**
 * Optimizes the visibility of the floating element by choosing the placement
 * that has the most space available automatically, without needing to specify a
 * preferred placement. Alternative to `flip`.
 * @see https://floating-ui.com/docs/autoPlacement
 */
declare const autoPlacement: (
  options?: AutoPlacementOptions | Derivable<AutoPlacementOptions>
) => Middleware;
declare type AutoPlacementOptions = Prettify<
  Omit<AutoPlacementOptions$1, "boundary"> & DetectOverflowOptions
>;
/**
 * Automatically updates the position of the floating element when necessary.
 * Should only be called when the floating element is mounted on the DOM or
 * visible on the screen.
 * @returns cleanup function that should be invoked when the floating element is
 * removed from the DOM or hidden from the screen.
 * @see https://floating-ui.com/docs/autoUpdate
 */
declare function autoUpdate(
  reference: ReferenceElement,
  floating: FloatingElement,
  update: () => void,
  options?: AutoUpdateOptions
): () => void;
declare interface AutoUpdateOptions {
  /**
   * Whether to update the position when an overflow ancestor is scrolled.
   * @default true
   */
  ancestorScroll?: boolean;
  /**
   * Whether to update the position when an overflow ancestor is resized. This
   * uses the native `resize` event.
   * @default true
   */
  ancestorResize?: boolean;
  /**
   * Whether to update the position when either the reference or floating
   * elements resized. This uses a `ResizeObserver`.
   * @default true
   */
  elementResize?: boolean;
  /**
   * Whether to update the position when the reference relocated on the screen
   * due to layout shift.
   * @default true
   */
  layoutShift?: boolean;
  /**
   * Whether to update on every animation frame if necessary. Only use if you
   * need to update the position in response to an animation using transforms.
   * @default false
   */
  animationFrame?: boolean;
}
/**
 * The clipping boundary area of the floating element.
 */
declare type Boundary = "clippingAncestors" | Element | Array<Element> | Rect;
/**
 * Computes the `x` and `y` coordinates that will place the floating element
 * next to a given reference element.
 */
declare const computePosition: (
  reference: ReferenceElement,
  floating: FloatingElement,
  options?: Partial<ComputePositionConfig>
) => Promise<ComputePositionReturn>;
declare type ComputePositionConfig = Prettify<
  Omit<ComputePositionConfig$1, "middleware" | "platform"> & {
    /**
     * Array of middleware objects to modify the positioning or provide data for
     * rendering.
     */
    middleware?: Array<Middleware | null | undefined | false>;
    /**
     * Custom or extended platform object.
     */
    platform?: Platform;
  }
>;
declare type Derivable<T> = (state: MiddlewareState) => T;
/**
 * Resolves with an object of overflow side offsets that determine how much the
 * element is overflowing a given clipping boundary on each side.
 * - positive = overflowing the boundary by that number of pixels
 * - negative = how many pixels left before it will overflow
 * - 0 = lies flush with the boundary
 * @see https://floating-ui.com/docs/detectOverflow
 */
declare const detectOverflow: (
  state: MiddlewareState,
  options?: DetectOverflowOptions | Derivable<DetectOverflowOptions>
) => Promise<SideObject>;
declare type DetectOverflowOptions = Prettify<
  Omit<DetectOverflowOptions$1, "boundary"> & {
    boundary?: Boundary;
  }
>;
declare interface Elements {
  reference: ReferenceElement;
  floating: FloatingElement;
}
/**
 * Optimizes the visibility of the floating element by flipping the `placement`
 * in order to keep it in view when the preferred placement(s) will overflow the
 * clipping boundary. Alternative to `autoPlacement`.
 * @see https://floating-ui.com/docs/flip
 */
declare const flip: (
  options?: FlipOptions | Derivable<FlipOptions>
) => Middleware;
declare type FlipOptions = Prettify<
  Omit<FlipOptions$1, "boundary"> & DetectOverflowOptions
>;
declare type FloatingElement = HTMLElement;
/**
 * Provides data to hide the floating element in applicable situations, such as
 * when it is not in the same clipping context as the reference element.
 * @see https://floating-ui.com/docs/hide
 */
declare const hide: (
  options?: HideOptions | Derivable<HideOptions>
) => Middleware;
declare type HideOptions = Prettify<
  Omit<HideOptions$1, "boundary"> & DetectOverflowOptions
>;
/**
 * Provides improved positioning for inline reference elements that can span
 * over multiple lines, such as hyperlinks or range selections.
 * @see https://floating-ui.com/docs/inline
 */
declare const inline: (
  options?: InlineOptions | Derivable<InlineOptions>
) => Middleware;
/**
 * Built-in `limiter` that will stop `shift()` at a certain point.
 */
declare const limitShift: (
  options?: LimitShiftOptions | Derivable<LimitShiftOptions>
) => {
  options: any;
  fn: (state: MiddlewareState) => Coords;
};
declare type Middleware = Prettify<
  Omit<Middleware$1, "fn"> & {
    fn(state: MiddlewareState): Promisable<MiddlewareReturn>;
  }
>;
/**
 * @deprecated use `MiddlewareState` instead.
 */
declare type MiddlewareArguments = MiddlewareState;
declare type MiddlewareState = Prettify<
  Omit<MiddlewareState$1, "elements"> & {
    elements: Elements;
  }
>;
declare interface NodeScroll {
  scrollLeft: number;
  scrollTop: number;
}
/**
 * Modifies the placement by translating the floating element along the
 * specified axes.
 * A number (shorthand for `mainAxis` or distance), or an axes configuration
 * object may be passed.
 * @see https://floating-ui.com/docs/offset
 */
declare const offset: (options?: OffsetOptions) => Middleware;
declare type OffsetOptions = OffsetValue | Derivable<OffsetValue>;
declare type OffsetValue =
  | number
  | {
      /**
       * The axis that runs along the side of the floating element. Represents
       * the distance (gutter or margin) between the reference and floating
       * element.
       * @default 0
       */
      mainAxis?: number;
      /**
       * The axis that runs along the alignment of the floating element.
       * Represents the skidding between the reference and floating element.
       * @default 0
       */
      crossAxis?: number;
      /**
       * The same axis as `crossAxis` but applies only to aligned placements
       * and inverts the `end` alignment. When set to a number, it overrides the
       * `crossAxis` value.
       *
       * A positive number will move the floating element in the direction of
       * the opposite edge to the one that is aligned, while a negative number
       * the reverse.
       * @default null
       */
      alignmentAxis?: number | null;
    };
declare interface Platform {
  getElementRects: (args: {
    reference: ReferenceElement;
    floating: FloatingElement;
    strategy: Strategy;
  }) => Promisable<ElementRects>;
  getClippingRect: (args: {
    element: Element;
    boundary: Boundary;
    rootBoundary: RootBoundary;
    strategy: Strategy;
  }) => Promisable<Rect>;
  getDimensions: (element: Element) => Promisable<Dimensions>;
  convertOffsetParentRelativeRectToViewportRelativeRect: (args: {
    elements?: Elements;
    rect: Rect;
    offsetParent: Element;
    strategy: Strategy;
  }) => Promisable<Rect>;
  getOffsetParent: (
    element: Element,
    polyfill?: (element: HTMLElement) => Element | null
  ) => Promisable<Element | Window>;
  isElement: (value: unknown) => Promisable<boolean>;
  getDocumentElement: (element: Element) => Promisable<HTMLElement>;
  getClientRects: (element: Element) => Promisable<Array<ClientRectObject>>;
  isRTL: (element: Element) => Promisable<boolean>;
  getScale: (element: HTMLElement) => Promisable<{
    x: number;
    y: number;
  }>;
}
declare const platform: Platform;
declare type Prettify<T> = { [K in keyof T]: T[K] } & {};
declare type Promisable<T> = T | Promise<T>;
declare type ReferenceElement = Element | VirtualElement;
/**
 * Optimizes the visibility of the floating element by shifting it in order to
 * keep it in view when it will overflow the clipping boundary.
 * @see https://floating-ui.com/docs/shift
 */
declare const shift: (
  options?: ShiftOptions | Derivable<ShiftOptions>
) => Middleware;
declare type ShiftOptions = Prettify<
  Omit<ShiftOptions$1, "boundary"> & DetectOverflowOptions
>;
/**
 * Provides data that allows you to change the size of the floating element —
 * for instance, prevent it from overflowing the clipping boundary or match the
 * width of the reference element.
 * @see https://floating-ui.com/docs/size
 */
declare const size: (
  options?: SizeOptions | Derivable<SizeOptions>
) => Middleware;
declare type SizeOptions = Prettify<
  Omit<SizeOptions$1, "apply" | "boundary"> &
    DetectOverflowOptions & {
      /**
       * Function that is called to perform style mutations to the floating element
       * to change its size.
       * @default undefined
       */
      apply?(
        args: MiddlewareState & {
          availableWidth: number;
          availableHeight: number;
        }
      ): Promisable<void>;
    }
>;
/**
 * Custom positioning reference element.
 * @see https://floating-ui.com/docs/virtual-elements
 */
declare interface VirtualElement {
  getBoundingClientRect(): ClientRectObject;
  getClientRects?(): Array<ClientRectObject> | DOMRectList;
  contextElement?: Element;
}
//#endregion
export {
  AlignedPlacement,
  Alignment,
  ArrowOptions,
  AutoPlacementOptions,
  AutoUpdateOptions,
  Axis,
  Boundary,
  ClientRectObject,
  ComputePositionConfig,
  ComputePositionReturn,
  Coords,
  Derivable,
  DetectOverflowOptions,
  Dimensions,
  ElementContext,
  ElementRects,
  Elements,
  FlipOptions,
  FloatingElement,
  HideOptions,
  InlineOptions,
  Length,
  LimitShiftOptions,
  Middleware,
  MiddlewareArguments,
  MiddlewareData,
  MiddlewareReturn,
  MiddlewareState,
  NodeScroll,
  OffsetOptions,
  Padding,
  Placement,
  Platform,
  Rect,
  ReferenceElement,
  RootBoundary,
  ShiftOptions,
  Side,
  SideObject,
  SizeOptions,
  Strategy,
  VirtualElement,
  arrow,
  autoPlacement,
  autoUpdate,
  computePosition,
  detectOverflow,
  flip,
  getOverflowAncestors,
  hide,
  inline,
  limitShift,
  offset,
  platform,
  shift,
  size,
};
