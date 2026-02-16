//#start
import "@1771technologies/lytenyte-pro-experimental/components.css";
import "@1771technologies/lytenyte-pro-experimental/light-dark.css";
import { Grid, useClientDataSource } from "@1771technologies/lytenyte-pro-experimental";
import { bankDataSmall } from "@1771technologies/grid-sample-data/bank-data-smaller";
import { BalanceCell, DurationCell, NumberCell } from "./components.jsx";
import { useRef } from "react";

type BankData = (typeof bankDataSmall)[number];
export interface GridSpec {
  readonly data: BankData;
}

const columns: Grid.Column<GridSpec>[] = [
  { name: "Job", id: "job", width: 120 },
  { name: "Age", id: "age", type: "number", width: 80, cellRenderer: NumberCell },
  { name: "Balance", id: "balance", type: "number", cellRenderer: BalanceCell },
  { name: "Education", id: "education" },
  { name: "Marital", id: "marital" },
  { name: "Default", id: "default" },
  { name: "Housing", id: "housing" },
  { name: "Loan", id: "loan" },
  { name: "Contact", id: "contact" },
  { name: "Day", id: "day", type: "number", cellRenderer: NumberCell },
  { name: "Month", id: "month" },
  { name: "Duration", id: "duration", type: "number", cellRenderer: DurationCell },
];

const base = { width: 100 };

//#end
export default function ExportDemo() {
  const ds = useClientDataSource({ data: bankDataSmall });
  const apiRef = useRef<Grid.API<GridSpec> | null>(null);

  return (
    <>
      <div className="border-ln-border border-b p-2">
        <button
          data-ln-button="website"
          data-ln-size="md"
          //!next 19
          onClick={async () => {
            const api = apiRef.current;
            if (!api) return;

            const rect = await api.exportData();

            const rows: string[] = [rect.columns.map((x) => x.name ?? x.id).join(",")];
            for (let i = 0; i < rect.data.length; i++) {
              const row: string[] = [];
              const data = rect.data[i];
              for (const x of data) {
                if (typeof x === "string") row.push(`"${x}"`);
                else row.push(String(x));
              }
              rows.push(row.join(","));
            }

            downloadBlob(new Blob([rows.join("\n")], { type: "text/csv" }), "data.csv");
          }}
        >
          Download CSV File
        </button>
      </div>
      <div className="ln-grid" style={{ display: "flex", flexDirection: "column" }}>
        <div style={{ height: 500 }}>
          <Grid columns={columns} columnBase={base} rowSource={ds} ref={apiRef} />
        </div>
      </div>
    </>
  );
}

function downloadBlob(blob: Blob, name: string) {
  // Convert your blob into a Blob URL (a special url that points to an object in the browser's memory)
  const blobUrl = URL.createObjectURL(blob);

  // Create a link element
  const link = document.createElement("a");

  // Set link's href to point to the Blob URL
  link.href = blobUrl;
  link.download = name;

  // Append link to the body
  document.body.appendChild(link);

  // Dispatch click event on the link
  // This is necessary as link.click() does not work on the latest firefox
  link.dispatchEvent(
    new MouseEvent("click", {
      bubbles: true,
      cancelable: true,
      view: window,
    }),
  );

  // Remove link from body
  document.body.removeChild(link);
}
