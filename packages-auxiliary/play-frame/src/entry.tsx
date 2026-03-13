import { createRoot } from "react-dom/client";
import { useEffect } from "react";
import frames from "playframe";
import config from "playframe-config";
import { Container } from "./container/container.js";
import { ThemeProvider, useTheme } from "next-themes";
import { NoDefault } from "./shell/no-default.js";
import axe from "axe-core";

function ThemeSync() {
  const { setTheme } = useTheme();

  useEffect(() => {
    const handler = (event: MessageEvent) => {
      if (event.data?.type === "play-frame-theme") {
        setTheme(event.data.theme);
      }
    };
    window.addEventListener("message", handler);
    return () => window.removeEventListener("message", handler);
  }, [setTheme]);

  return null;
}

const isFrame = window.top !== window.self;

const url = new URL(window.location.href);

if (isFrame || url.searchParams.get("full")) {
  axe.configure({});
  const frame = url.searchParams.get("frame")!;
  const component = frames[frame];

  const Render = component?.default ?? NoDefault;

  const element = document.getElementById("root")!;
  element.id = "play-root";

  const themeValues = config.themes.values.map((t) => t.value);

  createRoot(element).render(
    // <StrictMode>
    <ThemeProvider
      attribute={config.themes.attribute as "class"}
      themes={themeValues}
      defaultTheme={themeValues[0]}
    >
      <ThemeSync />
      <Container>
        <Render />
      </Container>
    </ThemeProvider>,
    // </StrictMode>
  );
} else {
  const shell = await import("./shell/main.js");
  createRoot(document.getElementById("root")!).render(
    // <StrictMode>
    <shell.Main />,
    // </StrictMode>
  );
}
