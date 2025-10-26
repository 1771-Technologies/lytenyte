import { createRoot } from "react-dom/client";
import frames from "playframe";
import { Container } from "./frame/container.js";
import { StrictMode } from "react";

const isFrame = window.top !== window.self;

const url = new URL(window.location.href);

if (isFrame || url.searchParams.get("full")) {
  import("./entry.css");
  // Function to apply the current theme
  function applyTheme() {
    const theme = localStorage.getItem("theme") || "light"; // default theme
    document.body.className = theme;
  }

  // Apply the theme on load
  applyTheme();

  // Listen for changes to localStorage from other tabs or scripts
  window.addEventListener("storage", (event) => {
    if (event.key === "theme") {
      applyTheme();
    }
  });

  const frame = url.searchParams.get("frame")!;
  const component = frames[frame];

  const Render = component?.default ?? (() => <>No Default Export</>);

  const element = document.getElementById("root")!;
  element.id = "play-root";

  createRoot(element).render(
    <StrictMode>
      <Container>
        <Render />
      </Container>
    </StrictMode>,
  );
} else {
  import("./index.css");

  const Frame = (await import("./frame/frame.js")).default;
  createRoot(document.getElementById("root")!).render(<Frame />);
}
