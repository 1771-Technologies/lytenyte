import { Button, DropdownMenu } from "@radix-ui/themes";
import { trees, type Demo } from "./demo-tree.js";

export interface DemoDropdownProps {
  readonly demo: Demo;
  readonly onDemoChange: (f: Demo) => void;
}

export function DemoDropdown({ demo, onDemoChange }: DemoDropdownProps) {
  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger>
        <Button aria-label="Play menu popover demo picker">
          {demo?.label
            ? `Demo: ${demo.path.length ? demo.path.join(" / ") + " / " : ""} ${demo.label}`
            : "No Plays"}
          <DropdownMenu.TriggerIcon />
        </Button>
      </DropdownMenu.Trigger>
      <DropdownMenu.Content
        size="1"
        style={{ minWidth: "var(--radix-dropdown-menu-trigger-width)" }}
      >
        {trees.map(function HandleTree(node) {
          if (node.kind === "leaf") {
            const f = node.node;

            return (
              <DropdownMenu.Item
                key={f.value}
                onClick={() => {
                  onDemoChange(f);
                }}
              >
                {f.label}
              </DropdownMenu.Item>
            );
          }

          return (
            <DropdownMenu.Sub key={node.label}>
              <DropdownMenu.SubTrigger>{node.label}</DropdownMenu.SubTrigger>
              <DropdownMenu.SubContent>
                {[...node.children.values()].map(HandleTree)}
              </DropdownMenu.SubContent>
            </DropdownMenu.Sub>
          );
        })}
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  );
}
