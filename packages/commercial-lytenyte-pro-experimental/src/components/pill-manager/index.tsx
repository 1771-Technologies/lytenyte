import type { PillContainer } from "./container.js";
import { PillContainer as Container } from "./container.js";
import type { PillRowExpander } from "./expander.js";
import { PillRowExpander as Expander } from "./expander.js";
import type { PillItem } from "./item.js";
import { PillItem as Pill } from "./item.js";
import type { PillLabel } from "./label.js";
import { PillLabel as Label } from "./label.js";
import type { PillRow } from "./pill-row.js";
import { PillRow as Row } from "./pill-row.js";
import { PillManager as Root } from "./root.js";

export const PillManager = (props: Root.Props) => <Root {...props} />;
PillManager.Container = Container;
PillManager.Expander = Expander;
PillManager.Pill = Pill;
PillManager.Label = Label;
PillManager.Row = Row;

export namespace PillManager {
  export type Props = Root.Props;
  export namespace Component {
    export type Container = PillContainer.Props;
    export type Expanded = PillRowExpander.Props;
    export type Pill = PillItem.Props;
    export type Label = PillLabel.Props;
    export type Row = PillRow.Props;
  }
}
