import { Button, DropdownMenu } from "@radix-ui/themes";
import { forest } from "./demo-tree.js";
import { ReactIcon } from "./react-icon.js";
import { FolderIcon } from "./folder-icon.js";
import { CheckmarkIcon } from "./checkmark-icon.js";

export interface Demo {
  readonly value: any;
  readonly label: string;
  readonly filePath: string;
}

export interface DemoDropdownProps {
  readonly demo: Demo;
  readonly onDemoChange: (f: Demo) => void;
}

export function DemoDropdown({ demo, onDemoChange }: DemoDropdownProps) {
  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger>
        <Button aria-label="Play menu popover demo picker">
          {demo?.label ?? "No Plays"}
          <DropdownMenu.TriggerIcon />
        </Button>
      </DropdownMenu.Trigger>
      <DropdownMenu.Content size="1" style={{ minWidth: "var(--radix-dropdown-menu-trigger-width)" }}>
        {forest.map(function HandleTree(node) {
          if (node.kind === "leaf") {
            const f = { value: node.value, label: node.label, filePath: node.filePath };

            return (
              <DropdownMenu.Item
                style={{ display: "flex", alignItems: "center" }}
                key={f.filePath}
                onClick={() => {
                  onDemoChange(f);
                }}
              >
                <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <ReactIcon style={{ width: 16, height: 16 }} />
                </div>
                <div style={{ flex: "1" }}>{f.label}</div>
                {demo.filePath === node.filePath && (
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      position: "relative",
                      left: 4,
                    }}
                  >
                    <CheckmarkIcon width={12} height={12} />
                  </div>
                )}
              </DropdownMenu.Item>
            );
          }

          return (
            <DropdownMenu.Sub key={node.label}>
              <DropdownMenu.SubTrigger>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <FolderIcon width={16} height={16} />
                </div>
                <div>{node.label}</div>
              </DropdownMenu.SubTrigger>
              <DropdownMenu.SubContent>{[...node.children.values()].map(HandleTree)}</DropdownMenu.SubContent>
            </DropdownMenu.Sub>
          );
        })}
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  );
}
