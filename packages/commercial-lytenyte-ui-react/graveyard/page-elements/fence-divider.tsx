import { tw } from "../components/tw.js";

export function FenceDivider(props: { className?: string }) {
  return (
    <div
      role="presentation"
      aria-hidden
      className={tw(
        "bg-[image:repeating-linear-gradient(315deg,_var(--pattern-fg)_0,_var(--pattern-fg)_1px,_transparent_0,_transparent_50%)] bg-[size:10px_10px] bg-fixed",
        "dark:[--pattern-fg:var(--color-gray-200)]/50 [--pattern-fg:var(--color-gray-300)]/40",
        props.className,
      )}
    />
  );
}
