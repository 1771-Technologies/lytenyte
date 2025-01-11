import { useSearchParams, type RouteObject } from "react-router-dom";
import { t } from "@1771technologies/grid-design";
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
        background-color: ${t.colors.backgrounds_page};
      `}
    >
      <div
        className={css`
          position: fixed;
          height: ${headerHeight};
          display: grid;
          grid-template-columns: ${sidebarWidth} 1fr;
          background-color: ${t.colors.backgrounds_ui_panel};
          width: 100%;
          z-index: 2;
        `}
      >
        <div
          className={css`
            background-color: ${t.colors.backgrounds_default};
            display: flex;
            align-items: center;
            padding-inline: ${t.spacing.space_50};
            border-right: 1px solid ${t.colors.borders_separator};
          `}
        >
          Title
        </div>
        <div
          className={css`
            display: flex;
            align-items: center;
            padding-inline: ${t.spacing.space_50};
            background-color: ${t.colors.backgrounds_default};
            border-bottom: 1px solid ${t.colors.borders_separator};
          `}
        >
          <ThemeSwitcher />
        </div>
      </div>
      <div
        className={css`
          position: fixed;
          height: 100vh;
          background-color: ${t.colors.backgrounds_default};
          width: ${sidebarWidth};
          padding-top: ${headerHeight};
          border-right: 1px solid ${t.colors.borders_separator};
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
            margin: ${t.spacing.space_30};
            width: calc(100% - ${t.spacing.space_30} * 2);
            height: calc(100% - ${t.spacing.space_30} * 2);
            border-radius: 4px;
            overflow: hidden;
            border: 1px solid ${t.colors.borders_strong};
            box-shadow: ${t.shadows[700]};
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
