import { clsx } from "@1771technologies/js-utils";
import {
  createContext,
  forwardRef,
  useMemo,
  useState,
  type Dispatch,
  type JSX,
  type SetStateAction,
} from "react";

interface PillRowContext {
  readonly expanded: boolean;
  readonly isScrolled: boolean;
  readonly expandable: boolean;
  readonly setExpanded: Dispatch<SetStateAction<boolean>>;
}

const PillRowContext = createContext<PillRowContext>(null as unknown as PillRowContext);

export const PillManagerRow = forwardRef<HTMLDivElement, JSX.IntrinsicElements["div"]>(
  function PillManagerRow(props, ref) {
    const [expanded, setExpanded] = useState(false);

    const value = useMemo<PillRowContext>(() => {
      return {
        expanded,
        setExpanded,
        isScrolled: false,
        expandable: false,
      };
    }, [expanded]);

    return (
      <PillRowContext value={value}>
        <div {...props} className={clsx("lng1771-pill-manager__row")} ref={ref}></div>
      </PillRowContext>
    );
  },
);
