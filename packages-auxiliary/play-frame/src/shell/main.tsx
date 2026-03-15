import "@radix-ui/themes/styles.css";
import "./index.css";

import { useCallback, useEffect, useRef, useState } from "react";
import { useLocalStorage } from "usehooks-ts";
import { Box, Flex, IconButton, Separator, Tabs, Theme } from "@radix-ui/themes";
import { FrameDropdown, type Frame } from "./frame-size-dropdown/frame-dropdown.js";
import type { Demo } from "./demo-dropdown/demo-dropdown.js";
import { IframeThemeDropdown } from "./iframe-theme-dropdown/iframe-theme-dropdown.js";
import { ExternalLinkIcon } from "@radix-ui/react-icons";

function SidebarCollapseIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 15 15" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <line x1="2.5" y1="2" x2="2.5" y2="13" />
      <polyline points="9,3 5,7.5 9,12" />
    </svg>
  );
}

function SidebarExpandIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 15 15" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <line x1="2.5" y1="2" x2="2.5" y2="13" />
      <polyline points="6,3 10,7.5 6,12" />
    </svg>
  );
}
import { DemoNav } from "./demo-nav/demo-nav.js";
import config from "playframe-config";
import type { AxeResults } from "axe-core";
import axe from "axe-core";
import { AxePopover } from "./axe-popover/axe-popover.js";
import { flatDemos } from "./demo-dropdown/demo-tree.js";
import { TestPanel } from "./test-panel/test-panel.js";

export function Main() {
  const savedIndex = localStorage.getItem("demo-key");

  const index = flatDemos.findIndex((x) => x.filePath === savedIndex);
  const [demoA, setDemoA] = useState<Demo | null>(flatDemos[index] ?? flatDemos[0]);
  const [demoB, setDemoB] = useState<Demo | null>(null);

  const [current, setCurrent] = useState<Demo>(demoA!);

  const setDemo = demoA ? setDemoB : setDemoA;
  const demo = (demoA ? demoA : demoB)!;

  const [active, setActive] = useState<"A" | "B" | null>(null);

  const [sidebarOpen, setSidebarOpen] = useLocalStorage<boolean>("sidebar-open", true);

  const [frame, setFrame] = useLocalStorage<Frame>(
    "frame",
    {
      name: "Default",
      height: undefined,
      width: undefined,
    },
    { deserializer: JSON.parse, serializer: JSON.stringify },
  );
  const [iframeTheme, setIframeTheme] = useLocalStorage<string>(
    "iframe-theme",
    config.themes.values[0]?.value ?? "light",
  );

  const activeThemeConfig =
    config.themes.values.find((t) => t.value === iframeTheme) ?? config.themes.values[0];
  const shellAppearance = activeThemeConfig?.colorScheme ?? "light";

  const axeRef = useRef<Promise<void>>(null);

  const postTheme = useCallback(
    (win: Window | null | undefined) => {
      win?.postMessage({ type: "play-frame-theme", theme: iframeTheme }, "*");
    },
    [iframeTheme],
  );

  useEffect(() => {
    postTheme(aRef.current?.contentWindow);
    postTheme(bRef.current?.contentWindow);
  }, [postTheme]);

  const aRef = useRef<HTMLIFrameElement>(null);
  const bRef = useRef<HTMLIFrameElement>(null);

  const [axeResults, setAxeResults] = useState<AxeResults | null>(null);
  const [axeLoading, setAxeLoading] = useState(false);

  const runAxe = useCallback(() => {
    setAxeLoading(true);
    setAxeResults(null);
    axeRef.current = axe
      .run({
        rules: {
          "page-has-heading-one": { enabled: false },
          "landmark-one-main": { enabled: false },
          region: { enabled: false },
        },
      })
      .then((res) => {
        setAxeResults(res);
        axeRef.current = null;
      })
      .finally(() => setAxeLoading(false));
  }, [setAxeLoading, setAxeResults]);

  return (
    <Theme radius="none" accentColor="violet" grayColor="slate" appearance={shellAppearance}>
      <Flex direction="column" style={{ height: "100dvh" }}>
        <Flex height="48px" minHeight="48px" maxHeight="48px" align="center" px="2" gap="2" justify="between">
          <Flex align="center" gap="2">
            <IconButton
              variant="ghost"
              aria-label="Toggle sidebar"
              onClick={() => setSidebarOpen((o) => !o)}
            >
              {sidebarOpen ? <SidebarCollapseIcon /> : <SidebarExpandIcon />}
            </IconButton>
          </Flex>

          <Flex gap="2">
            <AxePopover loading={axeLoading} results={axeResults} runAxe={runAxe} />
            <IconButton
              variant="soft"
              aria-label="Full frame view link"
              onClick={() => {
                const currentURL = new URL(window.location.href);
                currentURL.searchParams.set("frame", current.filePath);
                currentURL.searchParams.set("full", "true");
                window.open(currentURL.toString(), "_blank");
              }}
            >
              <ExternalLinkIcon />
            </IconButton>
            <IframeThemeDropdown theme={iframeTheme} onThemeChange={setIframeTheme} />
            <FrameDropdown frame={frame} onFrameChange={setFrame} />
          </Flex>
        </Flex>
        <Separator style={{ width: "100%" }} />

        <Flex style={{ flexGrow: 1, minHeight: 0, overflow: "hidden" }}>
          {/* Sidebar */}
          <div
            style={{
              width: sidebarOpen ? 240 : 0,
              height: "100%",
              overflowX: "hidden",
              overflowY: "auto",
              flexShrink: 0,
              transition: "width 200ms ease-in-out",
              borderRight: sidebarOpen ? "1px solid var(--gray-a5)" : undefined,
            }}
          >
            <DemoNav
              current={current}
              onSelect={(d) => {
                if (d.filePath === current.filePath) return;
                localStorage.setItem("demo-key", d.filePath);
                setDemo(d);
                setCurrent(d);
              }}
            />
          </div>

          {/* Main content */}
          <Tabs.Root
            defaultValue="stage"
            style={{ display: "flex", flexDirection: "column", flexGrow: 1, minWidth: 0 }}
          >
            <Tabs.List style={{ flexShrink: 0 }}>
              <Tabs.Trigger value="stage">Stage</Tabs.Trigger>
              <Tabs.Trigger value="tests">Tests</Tabs.Trigger>
            </Tabs.List>

            <Tabs.Content value="stage" forceMount style={{ flexGrow: 1, minHeight: 0, overflow: "hidden" }}>
              <Flex justify="center" pt="1" pb="2" px="1" style={{ flex: 1, minHeight: 0 }}>
                <Box
                  style={{
                    width: frame.width ?? "100%",
                    height: frame.height ?? "100%",
                    transitionProperty: "width height",
                    transitionTimingFunction: "ease-in-out",
                    transitionDuration: "200ms",
                    boxShadow: "var(--shadow-1)",
                  }}
                >
                  {demoA && (
                    <iframe
                      key="A"
                      ref={aRef}
                      title="Play Frame A"
                      src={`/?frame=${demoA.filePath}`}
                      onLoad={() => {
                        setTimeout(() => {
                          setActive("A");
                          setDemoB(null);
                          postTheme(aRef.current?.contentWindow);

                          setTimeout(() => {
                            if (axeRef.current) axeRef.current.then(() => runAxe());
                            else runAxe();
                          }, 500);
                        }, 200);
                      }}
                      style={{
                        opacity: demoB ? 0 : 1,
                        display: active === "A" ? undefined : "none",
                        border: "0px",
                        height: "100%",
                        width: "100%",
                      }}
                    />
                  )}
                  {demoB && (
                    <iframe
                      key="B"
                      ref={bRef}
                      title="Play Frame B"
                      src={`/?frame=${demoB.filePath}`}
                      onLoad={() => {
                        setTimeout(() => {
                          setActive("B");
                          setDemoA(null);
                          postTheme(bRef.current?.contentWindow);

                          setTimeout(() => {
                            if (axeRef.current) axeRef.current.then(() => runAxe());
                            else runAxe();
                          }, 500);
                        }, 200);
                      }}
                      style={{
                        display: active === "B" ? undefined : "none",
                        border: "0px",
                        opacity: demoA ? 0 : 1,
                        height: "100%",
                        width: "100%",
                      }}
                    />
                  )}
                </Box>
              </Flex>
            </Tabs.Content>

            <Tabs.Content value="tests" forceMount style={{ flexGrow: 1, minHeight: 0, overflow: "hidden" }}>
              <TestPanel demo={current} />
            </Tabs.Content>
          </Tabs.Root>
        </Flex>
      </Flex>
    </Theme>
  );
}
