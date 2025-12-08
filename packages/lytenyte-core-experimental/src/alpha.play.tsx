import { useMemo, useState } from "react";
import { Header } from "./header/header.js";
import { Root } from "./root/root.js";
import { Viewport } from "./viewport/viewport.js";
import { usePiece } from "./hooks/use-piece.js";
import { RowsContainer } from "./rows/rows-container/rows-container.js";
import { RowsBottom, RowsCenter, RowsTop } from "./rows/rows-section.js";
import type { RowSource } from "./types/row.js";
import type { Ln } from "./types.js";

const columns: Ln.Column<any>[] = [
  { id: "age", groupPath: ["A", "B"] },
  { id: "marital", groupPath: ["A"] },
  { id: "default", groupPath: ["T"] },
  { id: "housing" },
  { id: "loan" },
  { id: "contact", groupPath: ["A", "B", "C"] },
  { id: "day", groupPath: ["A", "B"] },
  { id: "month", groupPath: ["A"] },
  { id: "duration" },
  { id: "campaign" },
  { id: "pdays", groupPath: ["C"] },
  { id: "previous", groupPath: ["C", "D"] },
  { id: "poutcome", colSpan: 2 },
  { id: "y" },
];

export default function Experimental() {
  const [top] = useState(0);
  const [bot] = useState(0);
  const [center] = useState(100);

  const topPiece = usePiece(top);
  const botPiece = usePiece(bot);
  const countPiece = usePiece(center + top + bot);

  const data = useMemo(() => {
    return Array.from({ length: 2000 }, (_, i) => ({
      id: `${i}`,
      kind: "leaf" as const,
      data: { age: "3", marital: "A" },
    }));
  }, []);
  const ds = usePiece(data);

  const rowStore = useMemo<RowSource>(() => {
    return {
      id: "first",
      useBottomCount: botPiece.useValue,
      useTopCount: topPiece.useValue,
      useRowCount: countPiece.useValue,
      useSnapshotVersion: () => 1,
      rowIndexToRowId: (i: number) => `${i}`,
      rowByIndex: (i: number) => ({
        get: () => null,
        useValue: () => {
          return ds.useValue((x) => x[i]);
        },
      }),
    };
  }, [botPiece.useValue, countPiece.useValue, ds, topPiece.useValue]);

  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
      <button>A</button>
      <div style={{ height: "90vh", width: "90vw" }}>
        <Root columns={columns} rowSource={rowStore} floatingRowEnabled>
          <Viewport style={{ border: "1px solid white" }}>
            <Header />
            <RowsContainer>
              <RowsTop />
              <RowsCenter />
              <RowsBottom />
            </RowsContainer>
          </Viewport>
        </Root>
      </div>
      <button>A</button>
    </div>
  );
}
