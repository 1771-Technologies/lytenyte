import type {
  ListViewItemRendererProps,
  PathTreeInputItem,
} from "@1771technologies/react-list-view";
import { ListView } from "@1771technologies/react-list-view";
import { useGrid } from "../../provider/grid-provider";
import { useMemo } from "react";
import type { ColumnEnterpriseReact } from "@1771technologies/grid-types";
import { cc } from "../../component-configuration";
import { t } from "@1771technologies/grid-design";
import { CollapsedIcon, DragIcon, ExpandedIcon } from "../components";
import { Checkbox } from "../../checkbox/checkbox";
import { clsx } from "@1771technologies/js-utils";
import { handleItemHide } from "./handle-item-hide";
import { allLeafs } from "./all-leafs";
import { useDraggable } from "@1771technologies/react-dragon";

export function ColumnTree() {
  const { api, state } = useGrid();

  const config = cc.columnManager.use();
  const columns = state.columns.use();

  const expansions = state.internal.columnManagerTreeExpansions.use();

  const paths = useMemo(() => {
    const paths = columns.map<PathTreeInputItem<ColumnEnterpriseReact<any>>>((c) => {
      return { path: c.groupPath ?? [], data: c };
    });

    return paths;
  }, [columns]);

  return (
    <ListView
      paths={paths}
      axe={config.columnTree!.axe!}
      expansions={expansions}
      onAction={(item) => {
        handleItemHide(item, api);
      }}
      className={css`
        padding-block-start: 8px;
        box-sizing: border-box;
        max-width: 400px;
        overflow-x: hidden;
      `}
      itemClassName={css`
        padding-inline: ${t.spacing.space_10};
        user-select: none;
        cursor: pointer;

        &:focus {
          outline: none;

          & > div {
            background-color: ${t.colors.backgrounds_light};
            border-radius: ${t.spacing.box_radius_medium};
          }
        }
      `}
      onExpansionChange={(id, s) =>
        state.internal.columnManagerTreeExpansions.set((prev) => ({ ...prev, [id]: s }))
      }
      itemHeight={30}
      renderer={ColumnTreeRenderer}
    />
  );
}

const treeClx = css`
  display: flex;
  align-items: center;
  gap: 1px;
  height: 100%;
  padding-inline-end: ${t.spacing.space_30};
`;

function ColumnTreeRenderer(props: ListViewItemRendererProps<ColumnEnterpriseReact<any>>) {
  const { state } = useGrid();
  const base = state.columnBase.use();
  const columns = state.internal.columnLookup.use();

  if (props.data.type === "leaf") {
    const data = props.data.data;

    const column = columns.get(data.id)!;
    const hidden = column.hide ?? base.hide;
    const hidable = column.hidable ?? base.hidable ?? true;

    return (
      <div
        style={{
          paddingInlineStart: `calc(${t.spacing.space_30} + ${props.depth > 0 ? props.depth + 1 : 0} * ${t.spacing.space_30} + 22px)`,
        }}
        className={treeClx}
      >
        <DragIcon data={props.data} />
        <Checkbox tabIndex={-1} isChecked={!hidden} disabled={!hidable} />
        <span
          className={clsx(
            "lng1771-text-medium",
            css`
              margin-inline-start: 4px;
            `,
          )}
        >
          {data.headerName ?? data.id}
        </span>
      </div>
    );
  } else {
    const id = props.data.occurrence;
    const path = props.data.path.at(-1)!;

    const columns = allLeafs(props.data);
    const checked = columns.every((c) => !(c.hide ?? base.hide));
    const isIndeterminate = columns.some((c) => !(c.hide ?? base.hide)) && !checked;

    return (
      <div
        style={{
          paddingInlineStart: `calc(${t.spacing.space_30} + ${props.depth} * ${t.spacing.space_30})`,
        }}
        className={treeClx}
      >
        {props.expanded ? <ExpandedIcon id={id} /> : <CollapsedIcon id={id} />}
        <DragIcon data={props.data} />
        <Checkbox
          tabIndex={-1}
          isChecked={checked || isIndeterminate}
          isDeterminate={isIndeterminate}
        />

        <span
          className={clsx(
            "lng1771-text-medium",
            css`
              margin-inline-start: 4px;
            `,
          )}
        >
          {path}
        </span>
      </div>
    );
  }
}
