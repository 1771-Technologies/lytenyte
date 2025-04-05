import { useSearchParams, type RouteObject } from "react-router-dom";
import { useMemo } from "react";
import { ThemeSwitcher } from "./theme-switcher";
import { useTheme } from "./use-theme";

const headerHeight = "60px";
const sidebarWidth = "360px";

export function Shell(props: { routes: RouteObject[] }) {
  const [searchParams, setSearchParams] = useSearchParams();

  useTheme();
  const routes = useMemo(() => {
    return flattenRoutes(props.routes);
  }, [props.routes]);

  const frame = searchParams.get("frame") ?? "/play";
  return (
    <div
      className={css`
        background-color: black;
      `}
    >
      <div
        className={css`
          position: fixed;
          height: ${headerHeight};
          display: grid;
          grid-template-columns: ${sidebarWidth} 1fr;
          background-color: black;
          width: 100%;
          z-index: 2;
        `}
      >
        <div
          className={css`
            background-color: black;
            display: flex;
            align-items: center;
            padding-inline: 20px;
            border-right: 1px solid white;
          `}
        >
          Title
        </div>
        <div
          className={css`
            display: flex;
            align-items: center;
            padding-inline: 20px;
            background-color: black;
            border-bottom: 1px solid gray;
          `}
        >
          <ThemeSwitcher />
        </div>
      </div>
      <div
        className={css`
          position: fixed;
          height: 100vh;
          background-color: black;
          width: ${sidebarWidth};
          padding-top: ${headerHeight};
          border-right: 1px solid gray;
        `}
      >
        <ul>
          {routes.map((r) => {
            return (
              <li key={r.path!}>
                <button onClick={() => setSearchParams({ frame: r.path! })}>{r.path}</button>
              </li>
            );
          })}
        </ul>
      </div>
      <div
        className={css`
          padding-left: ${sidebarWidth};
          padding-top: ${headerHeight};
          box-sizing: border-box;
          width: 100vw;
          height: 100vh;
        `}
      >
        <div
          className={css`
            margin: 20px;
            width: calc(100% - 20px * 2);
            height: calc(100% - 20px * 2);
            border-radius: 4px;
            overflow: hidden;
            border: 1px solid gray;
          `}
        >
          <iframe
            className={css`
              width: 100%;
              height: 100%;
              box-sizing: border-box;
              border: none;
              background-color: transparent;
            `}
            src={frame}
          />
        </div>
      </div>
    </div>
  );
}

function flattenRoutes(routes: RouteObject[], parentPath = "") {
  const flattened: RouteObject[] = [];

  routes.forEach((route) => {
    // Construct the current path by combining parent path with current path
    const currentPath = parentPath ? `${parentPath}/${route.path}` : route.path;

    if (route.children) {
      // If the route has children, recursively flatten them
      const childRoutes = flattenRoutes(route.children, currentPath);
      flattened.push(...childRoutes);
    } else {
      // If it's a leaf route, add it to the flattened array
      flattened.push({
        path: currentPath,
        caseSensitive: route.caseSensitive,
        element: route.element,
      });
    }
  });

  return flattened;
}
