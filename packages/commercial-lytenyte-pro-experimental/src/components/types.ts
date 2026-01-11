import type { SlotComponent } from "../hooks/use-slot/types";

export type LnComponent<Props, State> = Props & { render?: SlotComponent<State> };
