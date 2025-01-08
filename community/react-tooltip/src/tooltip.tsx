import { type Rect } from "@1771technologies/positioner";
import { refCompat } from "@1771technologies/react-utils";
import {
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
  type ReactNode,
  type RefObject,
} from "react";
import { TooltipPortal } from "./tooltip-portal";

export interface ShowTooltipParams {
  readonly id: string;
  readonly content: ReactNode;
  readonly target: HTMLElement | Rect;
}

export interface TooltipApi {
  readonly show: (p: ShowTooltipParams) => void;
  readonly close: (id: string) => void;
}

export interface TooltipProps {
  readonly ref: RefObject<TooltipApi | null> | ((c: TooltipApi | null) => void);

  readonly onInit: (el: HTMLElement) => void;
  readonly onOpen: (el: HTMLElement) => void;
  readonly onClose: (el: HTMLElement) => void;
}

function TooltipImpl({ ref, onInit, onClose, onOpen }: TooltipProps) {
  const [immediate, setImmediate] = useState<Record<string, boolean>>({});
  const [shown, setShown] = useState<Record<string, boolean>>({});
  const [tooltips, setTooltips] = useState<Record<string, ShowTooltipParams>>({});
  const pending = useRef<Record<string, ReturnType<typeof setTimeout>>>({});

  const shownRef = useRef(shown);
  shownRef.current = shown;

  useImperativeHandle(ref, () => {
    const show = (p: ShowTooltipParams) => {
      const clear = () => {
        if (pending.current[p.id]) {
          clearTimeout(pending.current[p.id]);
          delete pending.current[p.id];
        }
      };

      const aTooltipIsAlreadyVisible = Object.values(shownRef.current).some((c) => c);
      if (aTooltipIsAlreadyVisible) {
        setShown((prev) => ({ ...prev, [p.id]: true }));
        setImmediate((prev) => ({ ...prev, [p.id]: true }));
        setTooltips((prev) => ({ ...prev, [p.id]: p }));
      } else {
        pending.current[p.id] = setTimeout(() => {
          setImmediate((prev) => ({ ...prev, [p.id]: true }));
          setShown((prev) => ({ ...prev, [p.id]: true }));
          setTooltips((prev) => ({ ...prev, [p.id]: p }));
          clear();
        }, 300);
      }
    };

    const close = (id: string) => {
      const clear = () => {
        if (pending.current[id]) {
          clearTimeout(pending.current[id]);
          delete pending.current[id];
        }
      };

      clear();

      setImmediate((prev) => ({ ...prev, [id]: false }));
      pending.current[id] = setTimeout(() => {
        setShown((prev) => ({ ...prev, [id]: false }));
        setTooltips((prev) => {
          const next = { ...prev };
          delete next[id];
          return next;
        });
        clear();
      }, 300);
    };

    return { close, show };
  });

  const tooltipContent = useMemo(() => {
    return Object.values(tooltips);
  }, [tooltips]);

  return (
    <>
      {tooltipContent.map((c) => {
        if (!shown[c.id]) return null;

        const content = c.content;

        return (
          <TooltipPortal
            target={c.target}
            shown={immediate[c.id]}
            onClose={onClose}
            onInit={onInit}
            onOpen={onOpen}
            key={c.id}
          >
            {content}
          </TooltipPortal>
        );
      })}
    </>
  );
}

export const Tooltip = refCompat<TooltipApi, TooltipProps>(TooltipImpl, "Tooltip");
