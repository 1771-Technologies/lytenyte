import { type Placement, type Rect } from "@1771technologies/positioner";
import { refCompat } from "@1771technologies/react-utils";
import {
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
  type RefObject,
} from "react";
import { TooltipPortal } from "./tooltip-portal";

export interface ShowTooltipParams {
  readonly id: string;
  readonly content: ReactNode;
  readonly target: HTMLElement | Rect;

  readonly offset?: number;
  readonly placement?: Placement;
}

export interface TooltipApi {
  readonly show: (p: ShowTooltipParams) => void;
  readonly update: (id: string, content: ReactNode) => void;
  readonly close: (id: string) => void;
  readonly isOpen: (id: string) => boolean;
}

export interface TooltipProps {
  readonly ref: RefObject<TooltipApi | null> | ((c: TooltipApi | null) => void);

  readonly arrowColor?: string;
  readonly className?: string;
  readonly style?: CSSProperties;

  readonly onInit: (el: HTMLElement) => void;
  readonly onOpen: (el: HTMLElement) => void;
  readonly onClose: (el: HTMLElement) => void;
}

function TooltipImpl({ ref, onInit, onClose, onOpen, arrowColor, className, style }: TooltipProps) {
  const [immediate, setImmediate] = useState<Record<string, boolean>>({});
  const [shown, setShown] = useState<Record<string, boolean>>({});
  const [tooltips, setTooltips] = useState<Record<string, ShowTooltipParams>>({});
  const [contentLookup, setContentLookup] = useState<Record<string, ReactNode>>({});
  const pending = useRef<Record<string, ReturnType<typeof setTimeout>>>({});

  const shownRef = useRef(shown);
  shownRef.current = shown;

  const api = useMemo(() => {
    const show = (p: ShowTooltipParams) => {
      const clear = () => {
        if (pending.current[p.id]) {
          clearTimeout(pending.current[p.id]);
          delete pending.current[p.id];
        }
      };

      clear();

      const aTooltipIsAlreadyVisible = Object.values(shownRef.current).some((c) => c);
      if (aTooltipIsAlreadyVisible) {
        setShown((prev) => ({ ...prev, [p.id]: true }));
        setImmediate((prev) => ({ ...prev, [p.id]: true }));
        setTooltips((prev) => ({ ...prev, [p.id]: p }));
        setContentLookup((prev) => ({ ...prev, [p.id]: p.content }));
      } else {
        pending.current[p.id] = setTimeout(() => {
          setImmediate((prev) => ({ ...prev, [p.id]: true }));
          setShown((prev) => ({ ...prev, [p.id]: true }));
          setTooltips((prev) => ({ ...prev, [p.id]: p }));
          setContentLookup((prev) => ({ ...prev, [p.id]: p.content }));
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

      setImmediate((prev) => {
        const next = { ...prev };
        delete next[id];
        return next;
      });
      pending.current[id] = setTimeout(() => {
        setShown((prev) => {
          const next = { ...prev };
          delete next[id];
          return next;
        });
        setTooltips((prev) => {
          const next = { ...prev };
          delete next[id];
          return next;
        });
        setContentLookup((prev) => {
          const next = { ...prev };
          delete next[id];
          return next;
        });
        clear();
      }, 300);
    };

    const update = (id: string, content: ReactNode) =>
      setContentLookup((prev) => ({ ...prev, [id]: content }));

    return { close, show, isOpen: (id: string) => shownRef.current[id] ?? false, update };
  }, []);

  useImperativeHandle(ref, () => {
    return api;
  }, [api]);

  const tooltipContent = useMemo(() => {
    return Object.values(tooltips);
  }, [tooltips]);

  return (
    <>
      {tooltipContent.map((c) => {
        if (!shown[c.id]) return null;

        return (
          <TooltipPortal
            arrowColor={arrowColor}
            className={className}
            params={c}
            api={api}
            style={style}
            target={c.target}
            offset={c.offset ?? 16}
            placement={c.placement ?? "top"}
            shown={immediate[c.id] ?? false}
            onClose={onClose}
            onInit={onInit}
            onOpen={onOpen}
            key={c.id}
          >
            {contentLookup[c.id]}
          </TooltipPortal>
        );
      })}
    </>
  );
}

export const Tooltip = refCompat<TooltipApi, TooltipProps>(TooltipImpl, "Tooltip");
