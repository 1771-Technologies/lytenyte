import { createContext, useContext, useMemo, type PropsWithChildren } from "react";
import type { Grid } from "../../../index.js";

const DEFAULT_EASING = "cubic-bezier(0.4, 0, 0.2, 1)";
const DEFAULT_MOVE_DURATION = 200;
const DEFAULT_ENTER_EXIT_DURATION = 200;
const DEFAULT_ENTER_EXIT_TYPE: Grid.RowAnimateEnterExitType = "fade";

export interface ResolvedRowAnimateMove {
  readonly duration: number;
  readonly easing: string;
}

export interface ResolvedRowAnimateEnterExit {
  readonly type: Grid.RowAnimateEnterExitType;
  readonly duration: number;
  readonly easing: string;
}

export interface RowAnimateSettings {
  readonly move: ResolvedRowAnimateMove | false;
  readonly enter: ResolvedRowAnimateEnterExit | false;
  readonly exit: ResolvedRowAnimateEnterExit | false;
}

const DISABLED: RowAnimateSettings = { move: false, enter: false, exit: false };

const context = createContext<RowAnimateSettings>(DISABLED);

function resolveMove(value: Grid.RowAnimateMove | false | undefined): ResolvedRowAnimateMove | false {
  if (value === false) return false;
  return {
    duration: value?.duration ?? DEFAULT_MOVE_DURATION,
    easing: value?.easing ?? DEFAULT_EASING,
  };
}

function resolveEnterExit(
  value: Grid.RowAnimateEnterExit | false | undefined,
): ResolvedRowAnimateEnterExit | false {
  if (value === false) return false;
  return {
    type: value?.type ?? DEFAULT_ENTER_EXIT_TYPE,
    duration: value?.duration ?? DEFAULT_ENTER_EXIT_DURATION,
    easing: value?.easing ?? DEFAULT_EASING,
  };
}

/**
 * Resolves the `rowAnimate` prop (boolean | config object) into a consistent shape so consumers
 * never have to deal with the raw union: `false`/undefined disables every phase; `true` enables
 * all three with defaults; an object enables each phase with defaults unless that specific key is
 * set to `false`.
 */
export function RowAnimateSettingsProvider({
  rowAnimate,
  children,
}: PropsWithChildren<{ rowAnimate: boolean | Grid.RowAnimate | undefined }>) {
  const settings = useMemo<RowAnimateSettings>(() => {
    if (!rowAnimate) return DISABLED;

    if (rowAnimate === true) {
      return {
        move: resolveMove(undefined),
        enter: resolveEnterExit(undefined),
        exit: resolveEnterExit(undefined),
      };
    }

    return {
      move: resolveMove(rowAnimate.move),
      enter: resolveEnterExit(rowAnimate.enter),
      exit: resolveEnterExit(rowAnimate.exit),
    };
  }, [rowAnimate]);

  return <context.Provider value={settings}>{children}</context.Provider>;
}

export const useRowAnimateSettings = () => useContext(context);
