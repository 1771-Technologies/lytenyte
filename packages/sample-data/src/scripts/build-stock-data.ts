import csv from "csv-parser";
import fs from "node:fs";
import path from "node:path";
import { dirname } from "node:path";
import { fileURLToPath } from "node:url";

function createDirname(url: string): string {
  return dirname(fileURLToPath(url));
}

const __dirname = createDirname(import.meta.url);

const stocksData = path.resolve(__dirname, "../datasets/stock-data.csv");
const stockDataDest = path.resolve(__dirname, "../stocks-data.ts");

fs.writeFileSync(stockDataDest, "// prettier-ignore\nexport const stockData = [\n");

const numberColumns = [
  "Price",
  "Price Change % 1 day",
  "Volume 1 day",
  "Relative Volume 1 day",
  "Market capitalization",
  "Price to earnings ratio",
  "EPS diluted, Trailing 12 months",
  "EPS diluted, Trailing 12 months - Currency",
  "EPS diluted growth %, TTM YoY",
  "Dividend yield %, Trailing 12 months",
];

const symbolFiles = fs.readdirSync(
  path.resolve(__dirname, "../../../../packages/lytenyte-grid-react-enterprise/public/symbols"),
);
const fileNames = new Set(
  symbolFiles.map((file) => {
    const baseFile = path.basename(file);
    return baseFile.replace(path.extname(baseFile), "");
  }),
);

fs.createReadStream(stocksData)
  .pipe(
    csv({
      separator: ",",
      mapValues: ({ header, value }) => {
        if (numberColumns.includes(header)) return Number.parseFloat(value as string);
        return value as string;
      },
    }),
  )
  .on("data", (d) => {
    const symbol = (d as { Symbol: string }).Symbol;
    const symbolName = symbol.split("/").at(0)!.split(".").at(0)!;
    if (!fileNames.has(symbolName) || (d as { Exchange: string }).Exchange === "AMEX") return;

    const values = Object.values(d as Record<string, string>).map((c) =>
      typeof c === "string" ? `"${c}"` : Number.isNaN(c) ? "null" : c,
    );

    fs.appendFileSync(stockDataDest, "\t[" + values.join(", ") + "],\n");
  })
  .on("end", () => {
    fs.appendFileSync(stockDataDest, "]");
  });
