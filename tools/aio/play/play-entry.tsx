import { StrictMode, Suspense } from "react";
import "@1771technologies/grid-design/css";
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

      color: var(--lng1771-gray-80);
      background-color: var(--lng1771-gray-00);
    }

    #root {
      min-height: 100dvh;
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
