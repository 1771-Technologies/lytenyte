import "@1771technologies/lytenyte-design/shadcn-vars.css";
import "@1771technologies/lytenyte-design/fonts.css";
import "../../css/grid-full.css";

import { useState } from "react";
import { bankDataSmall } from "@1771technologies/grid-sample-data/bank-data-smaller";
import { useClientDataSource } from "../data-source-client/use-client-data-source.js";
import { Grid } from "../index.js";
import { annotationBorder } from "./renderers/border.js";
import { annotationArrow } from "./renderers/arrow.js";
import { annotationComment } from "./renderers/comment.js";

type BankData = (typeof bankDataSmall)[number];

interface Spec extends Grid.GridSpec {
  data: BankData;
}

const columns: Grid.Column<Spec>[] = [
  { id: "age", pin: "start", width: 90 },
  { id: "job", pin: "start", width: 130 },
  { id: "balance", width: 110 },
  { id: "marital", width: 110 },
  { id: "education", width: 110 },
  { id: "default", width: 90 },
  { id: "housing", width: 90 },
  { id: "loan", width: 90 },
  { id: "contact", width: 110 },
  { id: "day", width: 90 },
  { id: "month", width: 90 },
  { id: "duration", width: 110 },
  { id: "campaign", pin: "end", width: 110 },
  { id: "y", pin: "end", width: 90 },
];

export default function AnnotationsPlay() {
  const [sync, setSync] = useState(false);

  const ds = useClientDataSource<Spec>({
    data: bankDataSmall,
    topData: bankDataSmall.slice(0, 2),
    botData: bankDataSmall.slice(0, 2),
  });

  const annotations: Grid.Annotation<Spec>[] = [
    {
      id: "range-corner",
      anchor: { kind: "range", rowStart: 0, rowEnd: 2, colStart: 0, colEnd: 2 },
      render: annotationBorder({ color: "#ef4444", width: 3 }),
    },
    {
      id: "range-center",
      anchor: { kind: "range", rowStart: 10, rowEnd: 13, colStart: 3, colEnd: 6 },
      render: annotationBorder({ color: "#22c55e" }),
    },
    {
      id: "point-comment",
      anchor: { kind: "point", x: 700, y: 800 },
      render: annotationComment({ text: "This scrolls with the data" }),
    },
    {
      id: "header-arrow-end",
      anchor: { kind: "header", colStart: 12, colEnd: 13 },
      render: annotationArrow({ direction: "down", color: "#3b82f6" }),
    },
    {
      id: "header-arrow-center",
      anchor: { kind: "header", colStart: 5, colEnd: 6 },
      render: annotationArrow({ direction: "down", color: "#f59e0b" }),
    },
    // Anchored entirely by row/column id instead of index.
    {
      id: "range-by-id",
      anchor: { kind: "range", rowStart: "leaf-15", rowEnd: "leaf-17", colStart: "contact", colEnd: "duration" },
      render: annotationBorder({ color: "#a855f7", width: 3 }),
    },
    // Unresolvable id - should be silently dropped, not rendered at all.
    {
      id: "range-bad-id",
      anchor: { kind: "range", rowStart: "does-not-exist", rowEnd: "leaf-17", colStart: 0, colEnd: 2 },
      render: annotationBorder({ color: "#000000" }),
    },
  ];

  return (
    <>
      <button onClick={() => setSync((s) => !s)}>Toggle suppressScrollFlash (sync mode)</button>
      <div style={{ width: "100%", height: "90vh" }} className="ln-grid ln-shadcn">
        <Grid
          columns={columns}
          columnBase={{ resizable: true }}
          rowSource={ds}
          suppressScrollFlash={sync}
          annotations={annotations}
        />
      </div>
    </>
  );
}
