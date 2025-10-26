import { AppSidebar } from "@/components/app-sidebar.js";
import { FrameDropdown, type Frame } from "@/components/frame-dropdown.js";
import { SiteHeader } from "@/components/site-header.js";
import { ThemeProvider } from "@/components/theme-provider.js";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar.js";

import "./tree.js";
import { useLocalStorage } from "usehooks-ts";
import { IFrameSwitcher, type FrameDemo } from "./iframe-switcher.js";
import { useState } from "react";
import { Button } from "@/components/ui/button.js";
import { ExternalLinkIcon } from "lucide-react";
import { tree } from "./tree.js";
import { SidebarTree } from "./sidebar-tree.js";

export default function Page() {
  const [frame, setFrame] = useLocalStorage<Frame>(
    "frame",
    {
      name: "Default",
      height: undefined,
      width: undefined,
    },
    { deserializer: JSON.parse, serializer: JSON.stringify },
  );

  const [demoA, setDemoA] = useLocalStorage<FrameDemo | null>("demoA", null, {
    deserializer: JSON.parse,
    serializer: JSON.stringify,
  });
  const [demoB, setDemoB] = useLocalStorage<FrameDemo | null>("demoB", null, {
    deserializer: JSON.parse,
    serializer: JSON.stringify,
  });

  const [current, setCurrent] = useState<FrameDemo>(demoA! ?? demoB!);

  const setDemo = demoA ? setDemoB : setDemoA;
  const demo = (demoA ? demoA : demoB)!;

  return (
    <ThemeProvider>
      <SidebarProvider
        style={
          {
            "--sidebar-width": "calc(var(--spacing) * 72)",
            "--header-height": "calc(var(--spacing) * 12)",
          } as React.CSSProperties
        }
      >
        <AppSidebar variant="inset">
          <SidebarTree
            tree={tree}
            current={current}
            onClick={(v) => {
              setCurrent(v);
              setDemo(v);
            }}
          />
        </AppSidebar>
        <SidebarInset>
          <SiteHeader header={current?.label ?? ""}>
            <FrameDropdown frame={frame} onFrameChange={setFrame} />

            <Button
              size="icon-sm"
              variant="outline"
              aria-label="Full frame view link"
              onClick={() => {
                const currentURL = new URL(window.location.href);
                currentURL.searchParams.set("frame", demo.value);
                currentURL.searchParams.set("full", "true");
                window.open(currentURL.toString(), "_blank");
              }}
            >
              <ExternalLinkIcon />
            </Button>
          </SiteHeader>
          <IFrameSwitcher
            frame={frame}
            demoA={demoA}
            demoB={demoB}
            setDemoA={setDemoA}
            setDemoB={setDemoB}
          />
        </SidebarInset>
      </SidebarProvider>
    </ThemeProvider>
  );
}
