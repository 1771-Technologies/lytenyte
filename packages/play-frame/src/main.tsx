import { createRoot } from "react-dom/client";
import frames from "playframe";
import { Container } from "./play-area/container.js";
import { ThemeProvider } from "next-themes";
import { NoDefault } from "./shell/no-default.js";
import axe from "axe-core";

const isFrame = window.top !== window.self;

const url = new URL(window.location.href);

if (isFrame || url.searchParams.get("full")) {
  axe.configure({});
  const frame = url.searchParams.get("frame")!;
  const component = frames[frame];

  const Render = (await component())?.default ?? NoDefault;

  const element = document.getElementById("root")!;
  element.id = "play-root";

  createRoot(element).render(
    // <StrictMode>
    <ThemeProvider attribute="class">
      <Container>
        <Render />
      </Container>
    </ThemeProvider>
    // </StrictMode>
  );
} else {
  const shell = await import("./shell/main.js");
  createRoot(document.getElementById("root")!).render(
    // <StrictMode>
    <ThemeProvider attribute="class">
      <shell.Main />
    </ThemeProvider>
    // </StrictMode>
  );
}
