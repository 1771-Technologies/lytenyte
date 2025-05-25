import { Component } from "react";
import type { Options as FocusTrapOptions } from "./focus-trap.js";

export interface FocusTrapProps {
  /**
   * __Single container child__ for the trap. Use `containerElements` instead
   *  if you need a trap with multiple containers.
   */
  children?: React.ReactNode;

  /**
   * By default, the trap will be active when it mounts, so it's activated by
   *  mounting, and deactivated by unmounting. Use this prop to control when
   *  it's active while it's mounted, or if it's initially inactive.
   */
  active?: boolean;

  /**
   * To pause or unpause the trap while it's `active`. Primarily for use when
   *  you need to manage multiple traps in the same view. When paused, the trap
   *  retains its various event listeners, but ignores all events.
   */
  paused?: boolean;

  /**
   * See Focus-trap's [createOptions](https://github.com/focus-trap/focus-trap?tab=readme-ov-file#createoptions)
   *  for more details on available options.
   */
  focusTrapOptions?: FocusTrapOptions;

  /**
   * If specified, these elements will be used as the boundaries for the
   *  trap, __instead of the child__ specified in `children` (though
   *  `children` will still be rendered).
   */
  containerElements?: Array<HTMLElement>;
}

export declare class FocusTrap extends Component<FocusTrapProps> {}
