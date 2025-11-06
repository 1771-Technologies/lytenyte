import type { JSX, ReactNode } from "react";
import { tw } from "./tw.js";

export interface NavbarProps {
  readonly start?: ReactNode;
  readonly center?: ReactNode;
  readonly end?: ReactNode;
  readonly floating?: boolean;
  readonly transparent?: boolean;
  readonly contained?: boolean;
  readonly large?: boolean;
}

export function Navbar({
  start,
  end,
  center,
  floating,
  contained = true,
  transparent,
  large,
  className,
  ...props
}: Omit<JSX.IntrinsicElements["div"], "children"> & NavbarProps) {
  return (
    <>
      <div role="presentation" className={tw(large ? "h-15" : "h-12", floating && "mt-3")} />
      <div
        {...props}
        className={tw(
          "fixed top-0 w-screen",
          large ? "h-15" : "h-12",
          transparent ? "bg-gray-50/50 backdrop-blur-sm" : "bg-gray-50",
          floating ? "top-3 bg-[unset] px-4 backdrop-blur-none" : "border-b border-gray-300/70",
          className,
        )}
      >
        <div
          className={tw(
            "flex h-full items-center gap-4 px-4",
            floating &&
              "container mx-auto rounded-3xl border border-gray-300/60 bg-gray-100 shadow",
            floating && transparent && "bg-gray-100/50 backdrop-blur-sm",
            contained && "container mx-auto",
          )}
        >
          <div>{start}</div>
          <div className="flex-1">{center}</div>
          {end && <div>{end}</div>}
        </div>
      </div>
    </>
  );
}
