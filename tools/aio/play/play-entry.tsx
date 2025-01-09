import { StrictMode, Suspense } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, useRoutes, type RouteObject } from "react-router-dom";

import { Shell } from "./shell";
import routes from "~react-pages";
import { useTheme } from "./use-theme";

const withHome: RouteObject[] = [{ path: "/", element: <Shell routes={routes} /> }, ...routes];

function App() {
  useTheme();
  return <Suspense fallback={<p>Loading...</p>}>{useRoutes(withHome)}</Suspense>;
}

const app = createRoot(document.getElementById("root")!);

const _ = css`
  :global() {
    html,
    body {
      margin: 0px;
      padding: 0px;
      box-sizing: border-box;
      min-height: 100dvh;
      font-family: ui-sans-serif, system-ui, sans-serif, "Apple Color Emoji", "Segoe UI Emoji",
        "Segoe UI Symbol", "Noto Color Emoji";
    }

    #root {
      min-height: 100dvh;
    }

    :root {
      --play-bg-color: #eeecec;
      --play-bg-sidebar: #f9f9f9;
      --play-bg-header: #ffffff;
      --play-bg-frame: #ffffff;
    }
  }
`;

app.render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
);
