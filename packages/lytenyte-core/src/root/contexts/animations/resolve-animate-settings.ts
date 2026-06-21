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

function resolveMove(value: Grid.AnimateMove | false | undefined): ResolvedAnimateMove | false {
  if (value === false) return false;
  return {
    duration: value?.duration ?? DEFAULT_MOVE_DURATION,
    easing: value?.easing ?? DEFAULT_EASING,
  };
}

function resolveEnterExit(
  value: Grid.AnimateEnterExit | false | undefined,
): ResolvedAnimateEnterExit | false {
  if (value === false) return false;
  return {
    type: value?.type ?? DEFAULT_ENTER_EXIT_TYPE,
    duration: value?.duration ?? DEFAULT_ENTER_EXIT_DURATION,
    easing: value?.easing ?? DEFAULT_EASING,
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
