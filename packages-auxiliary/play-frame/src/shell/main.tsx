import "@radix-ui/themes/styles.css";
import "./index.css";

import { useCallback, useRef, useState } from "react";
import { useLocalStorage } from "usehooks-ts";
import { Box, Flex, IconButton, Separator, Theme } from "@radix-ui/themes";
import { FrameDropdown, type Frame } from "./frame-size-dropdown/frame-dropdown.js";
import { DemoDropdown } from "./demo-dropdown/demo-dropdown.js";
import { ExternalLinkIcon, MoonIcon, SunIcon } from "@radix-ui/react-icons";
import { useTheme } from "next-themes";
import type { AxeResults } from "axe-core";
import axe from "axe-core";
import { AxePopover } from "./axe-popover/axe-popover.js";
import { demoOptions, type Demo } from "./demo-dropdown/demo-tree.js";

export function Main() {
  const savedIndex = localStorage.getItem("demo-key");
  const index = demoOptions.findIndex((x) => x.value === savedIndex);
  const [demoA, setDemoA] = useState<Demo | null>(demoOptions[index] ?? demoOptions[0]);
  const [demoB, setDemoB] = useState<Demo | null>(null);

  const [current, setCurrent] = useState<Demo>(demoA!);

  const setDemo = demoA ? setDemoB : setDemoA;
  const demo = (demoA ? demoA : demoB)!;

  const [active, setActive] = useState<"A" | "B" | null>(null);

  const [frame, setFrame] = useLocalStorage<Frame>(
    "frame",
    {
      name: "Default",
      height: undefined,
      width: undefined,
    },
    { deserializer: JSON.parse, serializer: JSON.stringify },
  );
  const { resolvedTheme, setTheme } = useTheme();

  const axeRef = useRef<Promise<void>>(null);

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
    <Theme
      radius="none"
      accentColor="violet"
      grayColor="slate"
      appearance={(resolvedTheme as "light" | "dark") ?? "dark"}
    >
      <Flex direction="column" style={{ height: "100dvh" }}>
        <Flex height="48px" align="center" px="4" gap="2" justify="between">
          <DemoDropdown
            demo={current}
            onDemoChange={(d) => {
              if (d === current) return;
              localStorage.setItem("demo-key", d.value);
              setDemo(d);
              setCurrent(d);
            }}
          />

          <Flex gap="2">
            <AxePopover loading={axeLoading} results={axeResults} runAxe={runAxe} />
            <IconButton
              onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
              variant="soft"
              aria-label="Theme picker"
            >
              {resolvedTheme === "dark" ? <MoonIcon /> : <SunIcon />}
            </IconButton>
            <IconButton
              variant="soft"
              aria-label="Full frame view link"
              onClick={() => {
                const currentURL = new URL(window.location.href);
                currentURL.searchParams.set("frame", demo.value);
                currentURL.searchParams.set("full", "true");
                window.open(currentURL.toString(), "_blank");
              }}
            >
              <ExternalLinkIcon />
            </IconButton>
            <FrameDropdown frame={frame} onFrameChange={setFrame} />
          </Flex>
        </Flex>
        <Separator style={{ width: "100%" }} />

        <Flex justify="center" pt="1" pb="2" px="1" flexGrow="1">
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
                src={`/?frame=${demoA.value}`}
                onLoad={() => {
                  setTimeout(() => {
                    setActive("A");
                    setDemoB(null);

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
                src={`/?frame=${demoB.value}`}
                onLoad={() => {
                  setTimeout(() => {
                    setActive("B");
                    setDemoA(null);

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
      </Flex>
    </Theme>
  );
}
