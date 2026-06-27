import type { Grid } from "../../../index.js";

const DEFAULT_EASING = "cubic-bezier(0.4, 0, 0.2, 1)";
const DEFAULT_MOVE_DURATION = 200;
const DEFAULT_ENTER_EXIT_DURATION = 200;
const DEFAULT_ENTER_EXIT_TYPE: Grid.AnimateEnterExitType = "fade";

export interface ResolvedAnimateMove {
  readonly duration: number;
  readonly easing: string;
}

export interface ResolvedAnimateEnterExit {
  readonly type: Grid.AnimateEnterExitType;
  readonly duration: number;
  readonly easing: string;
}

export interface AnimateSettings {
  readonly move: ResolvedAnimateMove | false;
  readonly enter: ResolvedAnimateEnterExit | false;
  readonly exit: ResolvedAnimateEnterExit | false;
}

export const DISABLED_ANIMATE_SETTINGS: AnimateSettings = { move: false, enter: false, exit: false };

function resolveMove(value: Grid.AnimateMove | boolean | undefined): ResolvedAnimateMove | false {
  if (value === false) return false;
  const spec = typeof value === "object" ? value : undefined;
  return {
    duration: spec?.duration ?? DEFAULT_MOVE_DURATION,
    easing: spec?.easing ?? DEFAULT_EASING,
  };
}

function resolveEnterExit(
  value: Grid.AnimateEnterExit | boolean | undefined,
): ResolvedAnimateEnterExit | false {
  if (value === false) return false;
  const spec = typeof value === "object" ? value : undefined;
  return {
    type: spec?.type ?? DEFAULT_ENTER_EXIT_TYPE,
    duration: spec?.duration ?? DEFAULT_ENTER_EXIT_DURATION,
    easing: spec?.easing ?? DEFAULT_EASING,
  };
}

export function resolveAnimateSettings(animate: boolean | Grid.Animate | undefined): AnimateSettings {
  if (!animate) return DISABLED_ANIMATE_SETTINGS;

  if (animate === true) {
    return {
      move: resolveMove(undefined),
      enter: resolveEnterExit(undefined),
      exit: resolveEnterExit(undefined),
    };
  }

  return {
    move: resolveMove(animate.move),
    enter: resolveEnterExit(animate.enter),
    exit: resolveEnterExit(animate.exit),
  };
}
