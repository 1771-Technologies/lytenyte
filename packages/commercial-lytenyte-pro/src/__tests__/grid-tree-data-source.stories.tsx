import type { Meta, StoryObj } from "@storybook/react";
import { Header } from "../header/header";
import { HeaderRow } from "../header/header-row";
import { Root } from "../root/root";
import { RowsContainer } from "../rows/rows-container";
import { Viewport } from "../viewport/viewport";
import { useLyteNyte } from "../state/use-lytenyte";
import { useId } from "react";
import { HeaderCell } from "../header/header-cell";
import type { Column } from "../+types";
import { HeaderGroupCell } from "../header/header-group-cell";
import { RowsBottom, RowsCenter, RowsTop } from "../rows/rows-sections";
import { RowHandler } from "./sample-data/row-handler";
import { useClientTreeDataSource } from "../row-data-source-client/use-client-tree-data-source";
import { ChevronDownIcon, ChevronRightIcon } from "../icons";
import { fileData } from "./db/file-data";

const meta: Meta = {
  title: "Grid/Tree Data Source",
};

export default meta;

const columns: Column<any>[] = [
  {
    id: "path",
    cellRenderer: ({ grid, row }) => {
      if (!row.data) return null;

      if (grid.api.rowIsLeaf(row)) {
        const field = row.data.path;

        return <div className="flex items-center px-2">{field}</div>;
      }
      const field = row.key;
      const isExpanded = grid.api.rowGroupIsExpanded(row);

      return (
        <div
          className="flex h-full w-full items-center gap-2"
          style={{ paddingLeft: row.depth * 16 }}
        >
          <button
            className="flex items-center justify-center"
            onClick={(e) => {
              e.stopPropagation();
              grid.api.rowGroupToggle(row);
            }}
          >
            {!isExpanded && <ChevronRightIcon />}
            {isExpanded && <ChevronDownIcon />}
          </button>

          <div>{`${field}`}</div>
        </div>
      );
    },
  },
  { id: "size" },
  { id: "lastModified" },
  { id: "type" },
  { id: "owner" },
  { id: "permissions" },
  { id: "isHidden" },
];

function MainComp() {
  const ds = useClientTreeDataSource<any>({
    data: fileData.filter((c) => c.type !== "directory"),
    getPathFromData: ({ data }) => {
      const path = data ? data.path.split("/").filter((c: any) => !!c) : [];

      return path;
    },
  });

  const g = useLyteNyte({
    gridId: useId(),
    columns,
    rowDataSource: ds,

    aggModel: {
      job: { fn: "first" },
      balance: { fn: "sum" },
      education: { fn: () => 1 },
    },
  });

  const view = g.view.useValue();

  return (
    <div>
      <div>
        <button onClick={() => g.state.rtl.set((prev) => !prev)}>
          RTL: {g.state.rtl.get() ? "Yes" : "No"}
        </button>
      </div>

      <div style={{ width: "100%", height: "90vh", border: "1px solid black" }}>
        <Root grid={g}>
          <Viewport>
            <Header>
              {view.header.layout.map((row, i) => {
                return (
                  <HeaderRow headerRowIndex={i} key={i}>
                    {row.map((c) => {
                      if (c.kind === "group") {
                        return (
                          <HeaderGroupCell
                            cell={c}
                            key={c.idOccurrence}
                            style={{ border: "1px solid black", background: "lightgray" }}
                          />
                        );
                      }
                      return (
                        <HeaderCell
                          cell={c}
                          key={c.column.id}
                          style={{ border: "1px solid black", background: "lightgray" }}
                        />
                      );
                    })}
                  </HeaderRow>
                );
              })}
            </Header>

            <RowsContainer>
              <RowsTop>
                <RowHandler rows={view.rows.top} />
              </RowsTop>
              <RowsCenter>
                <RowHandler rows={view.rows.center} />
              </RowsCenter>
              <RowsBottom>
                <RowHandler rows={view.rows.bottom} />
              </RowsBottom>
            </RowsContainer>
          </Viewport>
        </Root>
      </div>
    </div>
  );
}

export const TreeDataSource: StoryObj = {
  render: MainComp,
};
