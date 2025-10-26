import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu.js";
import { Button } from "@/components/ui/button.js";
import { FrameIcon } from "lucide-react";
import { Kbd, KbdGroup } from "./ui/kbd.js";

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
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button size="sm" variant={"outline"} aria-label="Frame size menu trigger">
          <FrameIcon /> {frame.name}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent style={{ minWidth: "var(--radix-dropdown-menu-trigger-width)" }}>
        {frames.map((f, i) => {
          if (typeof f === "string") return <DropdownMenuSeparator key={i} />;

          const shortcut = f.label ?? `${f.width}x${f.height}`;

          return (
            <DropdownMenuItem
              key={f.name}
              className="flex items-center justify-between gap-2"
              onClick={() => {
                onFrameChange(f);
              }}
            >
              {f.name}
              <KbdGroup>
                <Kbd className="px-2 font-mono">{shortcut}</Kbd>
              </KbdGroup>
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

const frames = [
  { name: "Default", width: undefined, height: undefined, label: "Fill Space" },
  "separator",
  { name: "Android Compact", width: 412, height: 917 },
  { name: "Android Medium", width: 700, height: 840 },
  { name: "iPhone 16", width: 393, height: 852 },
  { name: "iPhone 16 Pro", width: 402, height: 874 },
  { name: "iPhone 16 Pro Max", width: 440, height: 956 },
  { name: "iPhone 16 Plus", width: 430, height: 932 },
  { name: "iPhone 14 & 15 Pro Max", width: 430, height: 932 },
  { name: "iPhone 14 & 15 Pro", width: 393, height: 852 },
  { name: "iPhone 13 & 14", width: 390, height: 844 },
  { name: "iPhone 14 Plus", width: 428, height: 926 },
  { name: "iPhone 13 mini", width: 375, height: 812 },
  { name: "iPhone SE", width: 320, height: 568 },
  "separator",
  { name: "Tablet", width: 1280, height: 800 },
  { name: "Android Expanded", width: 1280, height: 800 },
  { name: "Surface Pro 8", width: 1440, height: 960 },
  { name: "iPad mini 8.3", width: 744, height: 1133 },
  { name: 'iPad Pro 11"', width: 834, height: 1194 },
  { name: 'iPad Pro 12.9"', width: 1024, height: 1366 },
  "separator",
  { name: "MacBook Air", width: 1280, height: 832 },
  { name: 'MacBook Pro 14"', width: 1512, height: 982 },
  { name: 'MacBook Pro 16"', width: 1728, height: 1117 },
  { name: "Desktop", width: 1440, height: 1024 },
  { name: "Wireframes", width: 1440, height: 1024 },
  { name: "TV", width: 1280, height: 720 },
  "separator",
  { name: "Slide 16:9", width: 1920, height: 1080 },
  { name: "Slide 4:3", width: 1024, height: 768 },
  "separator",
  { name: "A4", width: 595, height: 842 },
  { name: "A5", width: 420, height: 595 },
  { name: "A6", width: 297, height: 420 },
  { name: "Letter", width: 612, height: 792 },
  { name: "Tabloid", width: 792, height: 1224 },
  "separator",
  { name: "Twitter post", width: 1200, height: 675 },
  { name: "Twitter header", width: 1500, height: 500 },
  { name: "Facebook post", width: 1200, height: 630 },
  { name: "Facebook cover", width: 820, height: 312 },
  { name: "Instagram post", width: 1080, height: 1080 },
  { name: "Instagram story", width: 1080, height: 1920 },
  { name: "Dribble shot", width: 400, height: 300 },
  { name: "Dribble shot HD", width: 800, height: 600 },
  { name: "LinkedIn cover", width: "1584", height: 396 },
];
