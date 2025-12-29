import { Command } from "commander";
import { ensureDirSync } from "fs-extra";
import { findRootSync } from "@manypkg/find-root";
import { createWriteStream, readFileSync } from "fs";
import https from "https";

export const codecovCmd = new Command("codecov")
  .description("Creates a code coverage badge that can be used in a GitHub readme.")
  .action(async () => {
    const root = findRootSync(process.cwd());
    if (!root.rootDir) {
      console.error("Expected to be run in a npm project.");
      process.exitCode = 1;
      return;
    }

    try {
      const file = readFileSync(`${root.rootDir}/coverage/coverage-summary.json`, "utf-8");

      if (!file) {
        console.error("Expected coverage file to be present.");
        process.exitCode = 1;
        return;
      }

      const coverageReport = JSON.parse(file);
      const total = coverageReport.total.lines.pct;

      const url = generateCoverageBadge(total);
      ensureDirSync(`${root.rootDir}/resources`);
      downloadBadge(url, `${root.rootDir}/resources/codecov-badge.svg`);
    } catch (e) {
      console.error(e.message);
      process.exitCode = 1;
      return;
    }
  });

function generateCoverageBadge(coverage) {
  let color;

  if (coverage >= 90) {
    color = "brightgreen";
  } else if (coverage >= 75) {
    color = "green";
  } else if (coverage >= 60) {
    color = "yellowgreen";
  } else if (coverage >= 40) {
    color = "orange";
  } else {
    color = "red";
  }

  return `https://img.shields.io/badge/coverage-${encodeURIComponent(coverage + "%")}-${color}`;
}

// Function to download and save badge
function downloadBadge(url, filepath) {
  const file = createWriteStream(filepath);
  https
    .get(url, (response) => {
      response.pipe(file);
      file.on("finish", () => file.close());
    })
    .on("error", (err) => {
      fs.unlink(filepath, () => {});
      console.error(`Error downloading badge: ${err.message}`);
    });
}
