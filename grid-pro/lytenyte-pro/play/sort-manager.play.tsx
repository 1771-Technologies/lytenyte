import { columns } from "./data/columns";
import { bankDataSmall } from "./data/bank-data-small";
import { useClientDataSource } from "../src/use-client-data-source";
import { useLyteNytePro } from "../src/use-lytenyte";
import { LyteNyteGrid } from "../src";
import { SortManager } from "../src/sort-manager/sort-manager-impl";

export default function Play() {
  const ds = useClientDataSource({
    data: bankDataSmall,
    topData: bankDataSmall.slice(0, 2),
    bottomData: bankDataSmall.slice(0, 2),
  });

  const grid = useLyteNytePro({
    gridId: "x",
    columns: columns.map((c, i) => ({ ...c, hide: i % 2 === 0 })),
    rowDataSource: ds,

    rowSelectionMode: "multiple",
    rowSelectionCheckbox: "normal",
    rowDragEnabled: true,

    rowGroupModel: ["age", "education", "job"],

    columnBase: {
      resizable: true,
      movable: true,
      sortable: true,
      headerRenderer: ({ column, api }) => {
        return (
          <div
            style={{ width: "100%", height: "100%" }}
            onClick={(e) => api.columnMenuOpen(column, e.currentTarget)}
          >
            {column.headerName ?? column.id}
          </div>
        );
      },
    },
  });

  return (
    <div
      className={css`
        display: flex;
      `}
      style={{ width: "100vw", height: "100vh" }}
    >
      <div
        className={css`
          flex: 1;
        `}
      >
        <LyteNyteGrid grid={grid} />
      </div>
      <div
        className={css`
          flex: 1;
        `}
      >
        <SortManager.Root grid={grid}>
          <SortManager.Container
            className={css`
              padding-inline: 8px;
              padding-top: 20px;
            `}
          >
            {({ items }) => {
              return (
                <>
                  {items.map((c, i) => {
                    return (
                      <div
                        key={i}
                        className={css`
                          display: flex;
                          flex-direction: column;
                          gap: 8px;
                        `}
                      >
                        <SortManager.SortColumnSelect item={c} />
                        <SortManager.SortSelect item={c} />
                        <SortManager.SortDirectionSelect item={c} />
                        <SortManager.SortAdder item={c} />
                        <SortManager.SortRemove item={c} />
                      </div>
                    );
                  })}
                </>
              );
            }}
          </SortManager.Container>
          <SortManager.SortApply></SortManager.SortApply>
          <SortManager.SortCancel></SortManager.SortCancel>
          <SortManager.SortClear></SortManager.SortClear>
        </SortManager.Root>
      </div>
    </div>
  );
}
