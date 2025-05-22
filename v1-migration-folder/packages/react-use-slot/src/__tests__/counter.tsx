import { forwardRef, useMemo, useState, type CSSProperties } from "react";
import type { SlotComponent } from "../+types.use-slot";
import { useSlot } from "../use-slot";

interface CounterProps {
  slot?: SlotComponent<{ count: number }>;
  counter: number;
  onClick?: () => void;
  style?: CSSProperties;
  className?: string;
  onPointerDown?: () => void;
}

export const Counter = forwardRef<HTMLElement, CounterProps>(({ slot, ...props }, forwarded) => {
  const [count, setCount] = useState(0);

  const defaultProps = {
    onClick: () => setCount((prev) => prev + 1 * props.counter),
    children: count,
  };

  const el = useSlot({
    props: [defaultProps, props],
    slot: slot ?? <div />,
    ref: forwarded,
    state: useMemo(() => ({ count }), [count]),
  });

  return el;
});

export const CounterNoProps = forwardRef<HTMLElement, { slot?: SlotComponent }>(
  ({ slot }, forwarded) => {
    const [count, setCount] = useState(0);

    const defaultProps = {
      onClick: () => setCount((prev) => prev + 1),
      children: count,
    };

    const el = useSlot({
      props: defaultProps,
      slot: slot ?? <div />,
      ref: forwarded,
      state: useMemo(() => ({ count }), [count]),
    });

    return el;
  },
);
