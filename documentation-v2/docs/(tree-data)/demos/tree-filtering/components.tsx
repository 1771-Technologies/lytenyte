import "@1771technologies/lytenyte-pro/components.css";
import type { Grid } from "@1771technologies/lytenyte-pro";
import type { GridSpec } from "./demo.jsx";
import {
  ComponentsFolderClose,
  ComponentsFolderOpen,
  ConfigFolderClosed,
  ConfigFolderOpen,
  CSSIcon,
  DocumentIcon,
  DotFile,
  FolderBaseOpen,
  FolderIcon,
  GitIcon,
  HooksFolderClosedIcon,
  HooksFolderOpenIcon,
  HtmlIcon,
  IcoIcon,
  ImageIcon,
  JSIcon,
  JSONIcon,
  JSXIcon,
  MarkdownIcon,
  PublicFolderClosed,
  PublicFolderOpen,
  SrcFolderClosed,
  SrcFolderOpen,
  SvgIcon,
  TestsFolderClosed,
  TestsFolderOpen,
  TestsIcon,
  UtilsFolderClosedIcon,
  UtilsFolderOpenIcon,
} from "./icons.jsx";
import { useId, useMemo, type CSSProperties } from "react";
import { format } from "date-fns";
import { customerToAvatar } from "@1771technologies/grid-sample-data/orders";
import { Switch } from "radix-ui";

export function GroupCell({ api, row }: Grid.T.CellRendererParams<GridSpec>) {
  const expanded = api.rowIsGroup(row) && row.expandable && row.expanded;
  const expandable = api.rowIsGroup(row) && row.expandable;
  const name = api.rowIsGroup(row) ? (row.key ?? "") : ((row.data.name as string) ?? "");

  const Icon = useMemo(() => {
    if (name.includes(".test")) return TestsIcon;
    if (name.includes(".git")) return GitIcon;
    if (name.includes(".env")) return DotFile;

    if (name === "public") return expanded ? PublicFolderOpen : PublicFolderClosed;

    if (name === "src") return expanded ? SrcFolderOpen : SrcFolderClosed;
    if (name === "utils") return expanded ? UtilsFolderOpenIcon : UtilsFolderClosedIcon;
    if (name === "components") return expanded ? ComponentsFolderOpen : ComponentsFolderClose;
    if (name === "tests") return expanded ? TestsFolderOpen : TestsFolderClosed;
    if (name === "hooks") return expanded ? HooksFolderOpenIcon : HooksFolderClosedIcon;
    if (name === "config") return expanded ? ConfigFolderOpen : ConfigFolderClosed;

    if (name.endsWith(".jsx")) return JSXIcon;
    if (name.endsWith(".js")) return JSIcon;
    if (name.endsWith(".png") || name.endsWith(".jpg") || name.endsWith(".jpeg")) return ImageIcon;
    if (name.endsWith(".json")) return JSONIcon;
    if (name.endsWith(".md") || name.endsWith(".mdx")) return MarkdownIcon;
    if (name.endsWith(".html")) return HtmlIcon;
    if (name.endsWith(".ico")) return IcoIcon;
    if (name.endsWith(".svg")) return SvgIcon;
    if (name.endsWith(".css")) return CSSIcon;

    if (name.includes(".") || !expandable) return DocumentIcon;
    return expanded ? FolderBaseOpen : FolderIcon;
  }, [expandable, expanded, name]);

  return (
    <div
      className="relative flex h-full w-full items-center text-sm"
      style={{ paddingInlineStart: row.depth * 22 }}
    >
      {row.depth > 0 &&
        Array.from({ length: row.depth }, (_, i) => {
          return (
            <div
              key={i}
              className="border-ln-gray-30 absolute h-full border-s border-dashed"
              style={{ left: i === 0 ? 16 : i * 16 + 16 + i * 6 }}
            />
          );
        })}
      {expandable && (
        <button
          onClick={() => api.rowGroupToggle(row.id)}
          data-ln-button="secondary"
          data-ln-size="md"
          data-ln-icon
        >
          <Icon className="size-4" />
        </button>
      )}
      {!expandable && (
        <div className="flex size-8 items-center justify-center">
          <Icon className="size-4" />
        </div>
      )}
      <div>{name}</div>
    </div>
  );
}

const number = new Intl.NumberFormat("en-US", { maximumFractionDigits: 0, minimumFractionDigits: 0 });

export function SizeCell({ api, column, row }: Grid.T.CellRendererParams<GridSpec>) {
  if (!api.rowIsGroup(row)) return null;

  const field = api.columnField(column, row);

  if (typeof field !== "number") return "-";

  return (
    <div className="flex items-baseline gap-1 tabular-nums">
      {number.format(field)}
      <span className="text-ln-text-xlight text-xs font-semibold">kb</span>
    </div>
  );
}

export function ModifiedCell({ api, column, row }: Grid.T.CellRendererParams<GridSpec>) {
  if (!api.rowIsGroup(row)) return;

  const field = api.columnField(column, row);

  if (typeof field !== "string") return "-";

  return <div className="text-sm tabular-nums">{format(field, "yyyy MMM dd | hh:mm")}</div>;
}

export function AvatarCell({ api, row, column }: Grid.T.CellRendererParams<GridSpec>) {
  if (!api.rowIsGroup(row)) return;

  const name = api.columnField(column, row);

  if (typeof name !== "string") return;
  const url = customerToAvatar[name];

  return (
    <div className="flex h-full w-full items-center gap-2">
      <img className="border-ln-border-strong h-7 w-7 rounded-full border" src={url} alt={name} />
      <div className="text-ln-text-dark flex flex-col gap-0.5">
        <div>{name}</div>
      </div>
    </div>
  );
}

export function SwitchToggle(props: { label: string; checked: boolean; onChange: (b: boolean) => void }) {
  const id = useId();
  return (
    <div className="flex items-center gap-2">
      <label className="text-ln-text-dark text-sm leading-none" htmlFor={id}>
        {props.label}
      </label>
      <Switch.Root
        className="bg-ln-gray-10 data-[state=checked]:bg-ln-primary-50 h-5.5 w-9.5 border-ln-border-strong relative cursor-pointer rounded-full border outline-none"
        id={id}
        checked={props.checked}
        onCheckedChange={(c) => props.onChange(c)}
        style={{ "-webkit-tap-highlight-color": "rgba(0, 0, 0, 0)" } as CSSProperties}
      >
        <Switch.Thumb className="size-4.5 block translate-x-0.5 rounded-full bg-white/95 shadow transition-transform duration-100 will-change-transform data-[state=checked]:translate-x-4 data-[state=checked]:bg-white" />
      </Switch.Root>
    </div>
  );
}
