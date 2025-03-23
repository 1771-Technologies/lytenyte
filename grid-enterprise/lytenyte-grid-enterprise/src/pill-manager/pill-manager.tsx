import "./pill-manager.css";
import type { StoreEnterpriseReact } from "@1771technologies/grid-types";
import { GridProvider } from "../use-grid";
import {
  createContext,
  forwardRef,
  useMemo,
  useState,
  type Dispatch,
  type JSX,
  type PropsWithChildren,
  type SetStateAction,
} from "react";
import { type PillProps } from "../pill/pill";
import { PillManagerPills } from "./pill-manager-pills";
import { PillManagerPill } from "./pill-manager-pill";
import { clsx } from "@1771technologies/js-utils";

interface RootProps {
  readonly grid: StoreEnterpriseReact<any>;
}

function Root({ grid, children }: PropsWithChildren<RootProps>) {
  return <GridProvider value={grid}>{children}</GridProvider>;
}

export interface PillManagerPillItem {
  readonly kind: Required<PillProps>["kind"];
  readonly label: string;
  readonly secondaryLabel?: string;
  readonly active: boolean;
}

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

export const PillManager = {
  Root,
  Row: PillManagerRow,
  Pills: PillManagerPills,
  Pill: PillManagerPill,
};

/**

<PillManager.Root>
  <PillManager.Row>
    <PillManager.RowLabel />
    <PillManager.Pills>
      {({ pills }) => <PillManager.Pill item={item} />}
    </PillManager.Pills
    <PillManager.Expander />
  </PillManager.Row>
<PillManager.Root>

 */
