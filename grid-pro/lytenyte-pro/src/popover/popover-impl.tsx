import { Popover as P } from "@base-ui-components/react/popover";
import { forwardRef } from "react";
import { usePopoverClass } from "./use-popover-class";
import { ArrowSvg } from "../menu/arrow-svg";
import { useAnchor } from "../anchor-context/anchor-context";

export const PopoverBackdrop: typeof P.Backdrop = forwardRef(function PopoverBackdrop(
  { className, ...props },
  ref,
) {
  const cl = usePopoverClass("lng1771-popover__backdrop", className);

  return <P.Backdrop {...props} ref={ref} className={cl} />;
});

export const PopoverPopup: typeof P.Popup = forwardRef(function PopoverPopup(
  { className, ...props },
  ref,
) {
  const cl = usePopoverClass("lng1771-popover", className);

  return <P.Popup {...props} ref={ref} className={cl} />;
});

export const PopoverTitle: typeof P.Title = forwardRef(function PopoverTitle(
  { className, ...props },
  ref,
) {
  const cl = usePopoverClass("lng1771-popover__title", className);

  return <P.Title {...props} ref={ref} className={cl} />;
});

export const PopoverDescription: typeof P.Description = forwardRef(function PopoverDescription(
  { className, ...props },
  ref,
) {
  const cl = usePopoverClass("lng1771-popover__description", className);

  return <P.Description {...props} ref={ref} className={cl} />;
});

export const PopoverClose: typeof P.Close = forwardRef(function PopoverClose(
  { className, ...props },
  ref,
) {
  const cl = usePopoverClass("lng1771-popover__close", className);

  return <P.Close {...props} ref={ref} className={cl} />;
});

export const PopoverPositioner: typeof P.Positioner = forwardRef(function PopoverPositioner(
  { className, ...props },
  ref,
) {
  const target = useAnchor();
  const cl = usePopoverClass("lng1771-popover__positioner", className);
  return (
    <P.Positioner
      anchor={
        target
          ? "getBoundingClientRect" in target
            ? target
            : {
                getBoundingClientRect: () => ({
                  x: target.x,
                  y: target.y,
                  width: target.width,
                  height: target.height,
                  top: target.y,
                  left: target.x,
                  bottom: target.y,
                  right: target.x,
                  toJSON: () => "",
                }),
              }
          : undefined
      }
      sideOffset={8}
      {...props}
      ref={ref}
      className={cl}
    />
  );
});

export const PopoverArrow: typeof P.Arrow = forwardRef(function PopoverArrow(
  { className, ...props },
  ref,
) {
  const cl = usePopoverClass("lng1771-popover__arrow", className);
  return (
    <P.Arrow {...props} ref={ref} className={cl}>
      {props.children ?? <ArrowSvg />}
    </P.Arrow>
  );
});
