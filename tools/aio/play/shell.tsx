import { useSearchParams, type RouteObject } from "react-router-dom";
import { t } from "./theme";
import { useMemo } from "react";

const headerHeight = "60px";
const sidebarWidth = "360px";

export function Shell(props: { routes: RouteObject[] }) {
  const [searchParams, setSearchParams] = useSearchParams();

  const routes = useMemo(() => {
    return flattenRoutes(props.routes);
  }, [props.routes]);

  const frame = searchParams.get("frame") ?? "/play";
  return (
    <div
      className={css`
        background-color: ${t.colors.bg};
      `}
    >
      <div
        className={css`
          position: fixed;
          height: ${headerHeight};
          display: grid;
          grid-template-columns: ${sidebarWidth} 1fr;
          background-color: ${t.colors.bgHeader};
          width: 100%;
          z-index: 2;
        `}
      >
        <div
          className={css`
            background-color: ${t.colors.bgSideBar};
            display: flex;
            align-items: center;
            padding-inline: ${t.space._04};
          `}
        >
          Title
        </div>
        <div
          className={css`
            display: flex;
            align-items: center;
            padding-inline: ${t.space._04};
          `}
        >
          Toolbar
        </div>
      </div>
      <div
        className={css`
          position: fixed;
          height: 100vh;
          background-color: ${t.colors.bgSideBar};
          width: ${sidebarWidth};
          padding-top: ${headerHeight};
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
            background-color: ${t.colors.bgFrame};
            margin: ${t.space._04};
            width: calc(100% - ${t.space._04} * 2);
            height: calc(100% - ${t.space._04} * 2);
            border-radius: 4px;
          `}
        >
          <iframe
            className={css`
              width: 100%;
              height: 100%;
              box-sizing: border-box;
              border: none;
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
