import "@1771technologies/lytenyte-pro-experimental/components.css";
import { Popover, type Grid } from "@1771technologies/lytenyte-pro-experimental";
import type { GridSpec } from "./demo";

export function Header({ column }: Grid.T.HeaderParams<GridSpec>) {
  const label = column.name ?? column.id;

  return (
    <div className="flex h-full w-full items-center justify-between">
      <div>{label}</div>

      <Popover>
        <Popover.Trigger data-ln-button="secondary" data-ln-icon data-ln-size="sm">
          <div className="sr-only">Filter the {label}</div>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            fill="currentcolor"
            viewBox="0 0 256 256"
          >
            <path d="M230.6,49.53A15.81,15.81,0,0,0,216,40H40A16,16,0,0,0,28.19,66.76l.08.09L96,139.17V216a16,16,0,0,0,24.87,13.32l32-21.34A16,16,0,0,0,160,194.66V139.17l67.74-72.32.08-.09A15.8,15.8,0,0,0,230.6,49.53ZM40,56h0Zm106.18,74.58A8,8,0,0,0,144,136v58.66L112,216V136a8,8,0,0,0-2.16-5.47L40,56H216Z"></path>
          </svg>
        </Popover.Trigger>
        <Popover.Container>
          <Popover.Arrow />
          <Popover.Title className="sr-only">Filter {label}</Popover.Title>
          <Popover.Description className="sr-only">Filter the text in the{label}</Popover.Description>
        </Popover.Container>
      </Popover>
    </div>
  );
}

function TextFilterControl() {
  return <div className="grid"></div>;
}
