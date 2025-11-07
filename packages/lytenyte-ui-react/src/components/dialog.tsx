/* eslint-disable react-refresh/only-export-components */
import type { ComponentProps } from "react";
import { Dialog as D } from "../components-headless/dialog/dialog.js";
import { tw } from "./tw.js";
import { buttonStyles, type ButtonProps } from "./button.js";

const Container = (props: ComponentProps<typeof D.Container>) => {
  return (
    <D.Container
      {...props}
      className={tw(
        "top-1/5 start-1/2 grid -translate-x-1/2 -translate-y-1/2",
        "w-full max-w-[calc(100%-2rem)] gap-4 rounded-lg border border-gray-300/50 bg-gray-100 p-6 shadow-lg sm:max-w-lg dark:shadow-gray-400/10",

        // exit and enter animations
        "ln-opening:opacity-0 ln-closing:opacity-0 ln-opening:scale-95 ln-closing:scale-95 transition-[opacity,scale]",
        "ln-opening:backdrop:opacity-0 ln-closing:backdrop:opacity-0 backdrop:bg-gray-100/30 backdrop:transition-opacity",
        props.className,
      )}
    />
  );
};

const Trigger = ({
  kind = "primary",
  size = "default",
  ...props
}: ComponentProps<typeof D.Trigger> & ButtonProps) => {
  return <D.Trigger {...props} className={tw(buttonStyles({ kind, size }), props.className)} />;
};

const Close = ({
  kind = "tertiary",
  size = "default",
  ...props
}: ComponentProps<typeof D.Close> & ButtonProps) => {
  return <D.Close {...props} className={tw(buttonStyles({ kind, size }), props.className)} />;
};

// TODO style the close and trigger buttons
export const Dialog = {
  Root: D.Root,
  Container,
  Trigger,
  Close,
};
