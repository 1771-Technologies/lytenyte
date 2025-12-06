import type { SlotComponent } from "./hooks/use-slot/+types.use-slot";

export type LnComponent<Props, State> = Props & { render?: SlotComponent<State> };
