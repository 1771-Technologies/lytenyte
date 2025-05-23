import { createPortal } from "react-dom";
import { useMemo, useState, type CSSProperties, type PropsWithChildren } from "react";
import { useManagedDialog } from "./use-managed-dialog";
import type { OpenState } from "./use-transition-effect";

/**
 * <root>
 *  <trigger>
 *  <portal>
 *    <panel>
 *      <title />
 *      <description />
 *    </panel>
 *  </portal>
 * </root>
 */

export interface DialogRootProps {
  readonly open?: boolean;
  readonly onOpenChange?: (b: boolean) => void;
  readonly timeEnter?: number;
  readonly timeExit?: number;

  readonly className?: string;
  readonly style?: CSSProperties | ((state: OpenState) => CSSProperties);
}

export function Dialog({
  open,
  onOpenChange,
  children,
  style,
  timeEnter = 0,
  timeExit = 0,
  ...props
}: PropsWithChildren<DialogRootProps>) {
  const [localOpen, setLocalOpen] = useState(false);

  const { shouldMount, ref, state } = useManagedDialog(
    open ?? localOpen,
    onOpenChange ?? setLocalOpen,
    timeEnter,
    timeExit,
  );

  const finalStyle = useMemo(() => {
    if (!style) return;

    if (typeof style === "function") return style(state);
    return style;
  }, [state, style]);

  return createPortal(
    shouldMount && (
      <dialog {...props} data-dialog-state={state} ref={ref} style={finalStyle}>
        {children}
      </dialog>
    ),
    document.body,
  );
}
