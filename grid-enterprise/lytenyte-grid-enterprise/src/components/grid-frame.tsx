import { t } from "@1771technologies/grid-design";
import type { StoreEnterpriseReact } from "@1771technologies/grid-types";
import { clsx } from "@1771technologies/js-utils";
import { Sizer } from "@1771technologies/react-sizer";
import type { SplitPaneAxe } from "@1771technologies/react-split-pane";
import { SplitPane, splitPaneAxe } from "@1771technologies/react-split-pane";
import { useMemo, useState, type CSSProperties, type PropsWithChildren } from "react";

export interface GridFrameConfiguration {
  readonly axe?: SplitPaneAxe;
}

export interface GridFrameProps<D> {
  readonly grid: StoreEnterpriseReact<D>;
  readonly className?: string;
  readonly style?: CSSProperties;

  readonly axe?: SplitPaneAxe;
}

export function GridFrame<D>({
  grid: { api, state },
  className,
  style,
  children,
  axe,
}: PropsWithChildren<GridFrameProps<D>>) {
  const buttons = state.panelFrameButtons.use();
  const frames = state.panelFrames.use();
  const openId = state.internal.panelFrameOpen.use();

  const frame = openId ? frames[openId] : null;

  const [frameSplit, setFrameSplit] = useState(70);

  const template = useMemo(() => {
    const f = ["1fr"];
    if (buttons.length) f.push("32px");

    return f.join(" ");
  }, [buttons.length]);

  return (
    <div
      className={clsx(
        css`
          width: 100%;
          height: 100%;
          overflow: hidden;
          display: grid;
          grid-template-rows: 1fr;
        `,
        className,
      )}
      style={{ ...style, gridTemplateColumns: template }}
    >
      {frame ? (
        <>
          <SplitPane
            axe={axe ?? splitPaneAxe}
            orientation="vertical"
            primary={
              <div
                className={css`
                  width: 100%;
                  height: 100%;
                `}
              >
                {children}
              </div>
            }
            secondary={
              <Sizer
                className={css`
                  background-color: ${t.colors.backgrounds_ui_panel};
                  height: 100%;
                  width: 100%;
                  scrollbar-width: thin;
                `}
              >
                <frame.component api={api} frame={frame} />
              </Sizer>
            }
            split={frame ? frameSplit : 100}
            onSplitChange={(n) => setFrameSplit(n)}
            min={20}
            max={80}
            splitterClassName={css`
              width: 1px;
              background-color: ${t.colors.borders_strong};
              position: relative;
              cursor: col-resize;

              &::after {
                position: absolute;
                inset-inline-start: -4px;
                width: 4px;
                height: 100%;
                background-image: ${t.colors.gradient_shadow};
                opacity: 0.11;
                content: "";
              }
            `}
          />
        </>
      ) : (
        <div>{children}</div>
      )}
      {buttons.length > 0 && (
        <div
          className={css`
            height: 100%;
            width: 100%;
            writing-mode: vertical-lr;
            background-color: ${t.colors.backgrounds_ui_panel};
            border-block-start: 1px solid ${t.colors.borders_separator};
            box-sizing: border-box;
          `}
        >
          {buttons.map((c) => {
            const isActive = c.id === openId;
            return (
              <button
                key={c.id}
                onClick={() => {
                  if (isActive) api.panelFrameClose();
                  else api.panelFrameOpen(c.id);
                }}
                className={clsx(
                  "lng1771-text-small",

                  css`
                    width: 100%;
                    padding-inline: ${t.spacing.space_40};
                    border: 1px solid transparent;
                    border-inline-end: 1px solid ${t.colors.borders_separator};
                    background-color: ${t.colors.backgrounds_button_light};
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    gap: ${t.spacing.space_10};

                    &:focus {
                      outline: none;
                      border: 1px solid ${t.colors.borders_focus};
                    }

                    &:hover {
                      background-color: ${t.colors.backgrounds_light};
                    }
                  `,
                  c.id === openId &&
                    css`
                      background-color: ${t.colors.gray_10};
                    `,
                )}
              >
                <span
                  className={css`
                    color: ${t.colors.borders_icons_default};
                  `}
                >
                  {c.icon && <c.icon />}
                </span>
                <span>{c.label}</span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
