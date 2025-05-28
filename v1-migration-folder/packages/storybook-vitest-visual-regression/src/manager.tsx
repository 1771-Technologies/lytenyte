import { addons, types, type API } from "storybook/manager-api";
import { css } from "goober";
import { NAME, SVVR_ID, SVVR_INIT_REQ, SVVR_INIT_RES } from "./+constants";
import type { Addon_RenderOptions } from "storybook/internal/types";

// Storybooks requires this for some reason - didn't bother to investigate
import * as React from "react";
import type { SVVR_INIT_REQ_EVENT, SVVR_INIT_RES_EVENT } from "./+types";
import { ImageDiffer } from "./image-diff";

addons.register(NAME, (api) => {
  addons.add(SVVR_ID, {
    type: types.PANEL,
    title: "Visual Regression",
    match: ({ tabId, viewMode }) => !tabId && viewMode === "story",
    render: (props) => {
      if (!props.active) return null;

      return <Render {...props} api={api} />;
    },
  });
});

const buttonCls = css`
  background-color: black;
  color: white;
  border: none;
  font-weight: 500;
  font-size: 16px;
  padding: 8px 16px;
  font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
  cursor: pointer;
  width: 100%;
  text-align: start;

  &:hover {
    background-color: rgb(60, 60, 60);
  }
`;

function Render({ api }: Partial<Addon_RenderOptions> & { api: API }) {
  const storyData = api.getCurrentStoryData();

  const [loading, setLoading] = React.useState(true);
  const [screens, setScreens] = React.useState<
    { filename: string; base64: string; actual?: string }[]
  >([]);
  const [selected, setSelected] = React.useState<string | null>(null);

  React.useEffect(() => {
    api.emit(SVVR_INIT_REQ, {
      importPath: storyData.importPath,
      id: storyData.id,
    } satisfies SVVR_INIT_REQ_EVENT);

    return api.on(SVVR_INIT_RES, (ev: SVVR_INIT_RES_EVENT) => {
      setLoading(false);
      setScreens(ev.screenshots);
      if (ev.screenshots.length) {
        setSelected(ev.screenshots.at(0)!.filename);
      }
    });
  }, [api, storyData.id, storyData.importPath]);

  if (loading) {
    return (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        Loading...
      </div>
    );
  }

  const image = selected && screens.find((f) => f.filename === selected);
  return (
    <div
      style={{
        display: "flex",
        height: "100%",
        width: "100%",
      }}
    >
      <div
        style={{
          background: "black",
          borderRight: "1px solid gray",
          width: 350,
          boxSizing: "border-box",
          height: "100%",
          overflowX: "hidden",
          overflowY: "auto",
        }}
      >
        <div
          className={css`
            border-bottom: 1px solid white;
          `}
        >
          <button className={buttonCls}>Rerun</button>
        </div>
        <ul
          style={{
            display: "flex",
            flexDirection: "column",
            listStyle: "none",
            padding: 0,
            margin: 0,
          }}
        >
          {screens.map((f) => {
            return (
              <li style={{ borderBottom: "1px solid gray" }}>
                <button className={buttonCls} onClick={() => setSelected(f.filename)}>
                  {f.filename.replace(".png", "")}
                </button>
              </li>
            );
          })}
        </ul>
      </div>
      <div
        style={{
          width: "calc(100% - 350px)",
          overflow: "auto",
          height: "100%",
          boxSizing: "border-box",
        }}
      >
        {image && image.actual && (
          <ImageDiffer
            expected={`data:image/png;base64,${image.base64}`}
            actual={`data:image/png;base64,${image.actual}`}
          />
        )}
        {image && !image.actual && (
          <img
            style={{ display: "block", margin: "auto" }}
            src={`data:image/png;base64,${image.base64}`}
            alt=""
          />
        )}
      </div>
    </div>
  );
}
