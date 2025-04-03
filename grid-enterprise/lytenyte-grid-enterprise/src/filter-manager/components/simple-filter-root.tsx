import { forwardRef, type JSX, type PropsWithChildren } from "react";
import { useFilterManagerState } from "../filter-state-context";

export function SimpleFilterRoot(props: PropsWithChildren) {
  const { flatFilters } = useFilterManagerState();

  console.log(flatFilters);
  return <></>;
}
