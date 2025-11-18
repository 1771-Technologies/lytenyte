import csv from "csv-parser";
import fs from "node:fs";
import path from "node:path";
import { dirname } from "node:path";
import { fileURLToPath } from "node:url";

function createDirname(url: string): string {
  return dirname(fileURLToPath(url));
}

const __dirname = createDirname(import.meta.url);

const bankData = path.resolve(__dirname, "../datasets/bank.csv");

const dataFilePath = path.resolve(__dirname, "../bank-data.ts");
const dataFileLarge = path.resolve(__dirname, "../bank-data-large.ts");
const dataFileSmall = path.resolve(__dirname, "../bank-data-small.ts");

fs.writeFileSync(dataFilePath, "// prettier-ignore\nexport const bankData = [\n");
fs.writeFileSync(dataFileLarge, "// prettier-ignore\nexport const bankDataLarge = [\n");
fs.writeFileSync(dataFileSmall, "// prettier-ignore\nexport const bankDataSmall = [\n");

fs.createReadStream(bankData)
  .pipe(
    csv({
      separator: ";",
      mapValues: ({ header, value }) => {
        if (header === "age" || header === "balance" || header === "day" || header === "duration")
          return Number.parseInt(value as string);

        return value as string;
      },
    }),
  )
  .on("data", (d) => {
    fs.appendFileSync(dataFilePath, "\t" + JSON.stringify(d) + ",\n");
  })
  .on("end", () => {
    fs.appendFileSync(dataFilePath, "]");
  });

const bankDataLarge = path.resolve(__dirname, "../datasets/bank-full.csv");
fs.createReadStream(bankDataLarge)
  .pipe(
    csv({
      separator: ";",
      mapValues: ({ header, value }) => {
        if (header === "age" || header === "balance" || header === "day" || header === "duration")
          return Number.parseInt(value as string);

        return value as string;
      },
    }),
  )
  .on("data", (d) => {
    fs.appendFileSync(dataFileLarge, "\t" + JSON.stringify(d) + ",\n");
  })
  .on("end", () => {
    fs.appendFileSync(dataFileLarge, "]");
  });

const bankDataSmall = path.resolve(__dirname, "../datasets/bank-small.csv");
fs.createReadStream(bankDataSmall)
  .pipe(
    csv({
      separator: ";",
      mapValues: ({ header, value }) => {
        if (header === "age" || header === "balance" || header === "day" || header === "duration")
          return Number.parseInt(value as string);

        return value as string;
      },
    }),
  )
  .on("data", (d) => {
    fs.appendFileSync(dataFileSmall, "\t" + JSON.stringify(d) + ",\n");
  })
  .on("end", () => {
    fs.appendFileSync(dataFileSmall, "]");
  });
