import Link, { LinkProps } from "next/link";
import { forwardRef } from "react";

export const Anchor = forwardRef<HTMLAnchorElement, LinkProps>(function Anchor(props, ref) {
  return (
    <>
      <Link
        {...props}
        className="text-link hover:text-brand-800 font-semibold transition-colors"
        ref={ref}
      />
    </>
  );
});
