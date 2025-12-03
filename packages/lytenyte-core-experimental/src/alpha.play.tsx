import { useMemo, useState } from "react";
import { Header } from "./header/header.js";
import { Root } from "./root/root.js";
import type { Column } from "./types/column.js";
import { Viewport } from "./viewport/viewport.js";
import { usePiece } from "./hooks/use-piece.js";
import type { RowSource } from "./types/row.js";
import { RowsContainer } from "./rows/rows-container.js";
import { RowsBottom, RowsCenter, RowsTop } from "./rows/rows-section.js";

const columns: Column<any>[] = [
  {
    id: "age",
    groupPath: ["A", "B"],
  },
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
  const [center] = useState(200);

  const topPiece = usePiece(top);
  const botPiece = usePiece(bot);
  const countPiece = usePiece(center + top + bot);

  const rowStore = useMemo<RowSource>(() => {
    return {
      id: "first",
      useBottomCount: botPiece.useValue,
      useTopCount: topPiece.useValue,
      useRowCount: countPiece.useValue,
      useSnapshotVersion: () => 1,
      rowIndexToRowId: (i: number) => `${i}`,
      rowByIndex: () => ({ get: () => null, useValue: () => null }),
    };
  }, [botPiece.useValue, countPiece.useValue, topPiece.useValue]);

  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
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
    </div>
  );
}
