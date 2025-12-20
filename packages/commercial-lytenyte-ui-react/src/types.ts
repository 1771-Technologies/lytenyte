import type { SlotComponent } from "@1771technologies/lytenyte-hooks-react";

export type LnComponent<Props, State> = Props & { render?: SlotComponent<State> };
