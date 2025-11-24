import type { ComponentProps } from "react";
import { Arrow } from "./arrow.js";
import { Close } from "./close.js";
import { Container } from "./container.js";
import { Description } from "./description.js";
import { Root, type RootProps } from "./root.js";
import { Title } from "./title.js";
import { Trigger } from "./trigger.js";

export const Dialog = {
  Root,
  Description,
  Title,
  Container,
  Trigger,
  Close,
  Arrow,
};

export type DialogProps = {
  Root: RootProps;
  Description: ComponentProps<typeof Description>;
  Title: ComponentProps<typeof Title>;
  Container: ComponentProps<typeof Container>;
  Trigger: ComponentProps<typeof Trigger>;
  Close: ComponentProps<typeof Close>;
  Arrow: ComponentProps<typeof Arrow>;
};
