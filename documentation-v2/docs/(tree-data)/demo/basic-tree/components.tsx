import type { Grid } from "@1771technologies/lytenyte-pro-experimental";
import type { GridSpec } from "./demo";
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
} from "./icons.js";
import { useMemo } from "react";

export function GroupCell({ api, row }: Grid.T.CellRendererParams<GridSpec>) {
  const Icon = useMemo(() => {
    if (!api.rowIsGroup(row)) return null;
    const name = row.key ?? "";
    const expanded = row.expandable && row.expanded;

    if (name.includes(".test")) return TestsIcon;
    if (name.includes(".git")) return GitIcon;
    if (name.includes(".env")) return DotFile;

    if (name === "public") {
      return expanded ? PublicFolderOpen : PublicFolderClosed;
    }
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

    if (name.includes(".")) return DocumentIcon;
    return expanded ? FolderBaseOpen : FolderIcon;
  }, [api, row]);

  if (!api.rowIsGroup(row) || !Icon) return null;

  return (
    <div
      className="flex h-full w-full items-center gap-2 text-sm"
      style={{ paddingInlineStart: row.depth * 16 }}
    >
      <Icon className="size-4 min-h-4 min-w-4" />
      <div>{row.key}</div>
    </div>
  );
}
