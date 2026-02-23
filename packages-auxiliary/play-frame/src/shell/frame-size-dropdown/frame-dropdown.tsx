import { Button, DropdownMenu, Text } from "@radix-ui/themes";
import { FrameIcon } from "@radix-ui/react-icons";
import { FRAME_SIZES } from "./frame-sizes.js";

export interface Frame {
  readonly name: string;
  readonly width: number | undefined | string;
  readonly height: number | undefined | string;
}

export interface FrameDropdownProps {
  readonly frame: Frame;
  readonly onFrameChange: (f: Frame) => void;
}

export function FrameDropdown({ frame, onFrameChange }: FrameDropdownProps) {
  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger>
        <Button variant="soft" aria-label="Frame size menu trigger">
          <FrameIcon />
          {frame.name}
          <DropdownMenu.TriggerIcon />
        </Button>
      </DropdownMenu.Trigger>
      <DropdownMenu.Content size="1" style={{ minWidth: "var(--radix-dropdown-menu-trigger-width)" }}>
        {FRAME_SIZES.map((f, i) => {
          if (typeof f === "string") return <DropdownMenu.Separator key={i} />;

          const shortcut = f.label ?? `${f.width}x${f.height}`;

          return (
            <DropdownMenu.Item
              key={f.name}
              style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "24px" }}
              // shortcut={shortcut}
              onClick={() => {
                onFrameChange(f);
              }}
            >
              <span>{f.name}</span>
              <Text style={{ fontFamily: "monospace" }}>{shortcut}</Text>
            </DropdownMenu.Item>
          );
        })}
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  );
}
