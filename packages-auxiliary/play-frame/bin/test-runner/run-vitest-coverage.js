import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { importVitest } from "./import-vitest.js";
import { getVitest, closeVitest } from "./vitest-instance.js";
import { StreamingReporter } from "./streaming-reporter.js";
import { buildTestFileResult } from "./build-test-file-result.js";
import { buildSummary } from "./build-summary.js";
import { buildCoverageResult } from "./build-coverage-result.js";

const COVERAGE_DIR = ".play-coverage";

// Cached per-cwd so back-to-back coverage runs don't need to re-detect.
// p.browser is only populated once browsers connect (during collect/run),
// not just from init(). Caching avoids polling a freshly-created instance
// that has never run any tests.
let cache = null; // { cwd, chromiumProjectNames, fileCoverage }

export async function runVitestCoverage({
  cwd,
  testFiles,
  touchedOnly,
  onModule,
  onTestCaseStart,
  onTestCase,
  onDone,
  onError,
}) {
  const reporter = new StreamingReporter();
  let vitest = null;

  try {
    let chromiumProjectNames;
    let fileCoverage;

    if (cache?.cwd === cwd) {
      // Reuse from a previous successful detection (browsers were connected then).
      chromiumProjectNames = cache.chromiumProjectNames;
      fileCoverage = cache.fileCoverage;
    } else {
      // First run for this cwd — detect from the live long-lived instance.
      // p.browser is populated only after browsers connect, which happens during
      // collect/run. By the time the user clicks Coverage, collect has already run.
      const existingVitest = await getVitest(cwd);

      chromiumProjectNames = existingVitest.projects
        .filter((p) => p.browser?.provider.browserName === "chromium")
        .map((p) => p.name);

      if (chromiumProjectNames.length === 0) {
        onError("No chromium project found that supports V8 coverage");
        return;
      }

      const { reporter: _reporter, ...cov } = existingVitest.config.coverage ?? {};
      fileCoverage = cov;
    }

    // Release the long-lived instance so its Playwright processes don't
    // conflict with the coverage instance we're about to create.
    await closeVitest();

    // Give Playwright browser processes time to fully terminate before
    // the coverage instance tries to launch its own.
    await new Promise((r) => setTimeout(r, 1500));

    const { createVitest } = await importVitest(cwd);

    vitest = await createVitest(
      "test",
      {
        watch: false,
        reporters: [reporter],
        // Only initialize chromium projects — coverage-v8 rejects firefox/webkit
        project: chromiumProjectNames,
        coverage: {
          ...fileCoverage,
          enabled: true,
          // json is required for coverage-final.json; text prints a summary to the terminal
          reporter: ["json", "text"],
          reportsDirectory: join(cwd, COVERAGE_DIR),
          // touchedOnly: only report files actually imported during the run (all: false).
          // Default (all: true) includes every file matching include, even untouched ones.
          all: !touchedOnly,
        },
      },
      { root: cwd },
    );

    await vitest.init();

    const collectedModules = [];

    reporter.setOnModule((testModule) => {
      const mod = buildTestFileResult(testModule);
      collectedModules.push(mod);
      onModule(mod);
    });

    reporter.setOnTestCaseStart((testCase) => {
      onTestCaseStart({
        filepath: testCase.module.moduleId,
        projectName: testCase.project?.name ?? "",
        fullName: testCase.fullName,
      });
    });

    reporter.setOnTestCase((testCase) => {
      const result = testCase.result();
      onTestCase({
        filepath: testCase.module.moduleId,
        projectName: testCase.project?.name ?? "",
        fullName: testCase.fullName,
        state: result?.state ?? "pending",
        duration: testCase.diagnostic?.()?.duration,
        errors: result?.errors?.map((e) => e.message ?? String(e)) ?? [],
      });
    });

    const allSpecs = await vitest.globTestSpecifications();
    const specs = allSpecs.filter((spec) => testFiles.includes(spec.moduleId));

    // allTestsRun=true is required for Vitest to emit coverage data
    await vitest.runTestSpecifications(specs, true);

    const coveragePath = join(cwd, COVERAGE_DIR, "coverage-final.json");
    const istanbulJson = JSON.parse(await readFile(coveragePath, "utf-8"));
    const coverageData = await buildCoverageResult(istanbulJson, cwd);

    // Persist detection results so the next coverage run skips the live lookup.
    cache = { cwd, chromiumProjectNames, fileCoverage };

    onDone(buildSummary(collectedModules), coverageData);
  } catch (e) {
    console.error("[play-frame coverage] Error:", e);
    if (e?.cause) console.error("[play-frame coverage] Cause:", e.cause);
    onError(e?.message ?? String(e));
  } finally {
    reporter.setOnModule(null);
    reporter.setOnTestCaseStart(null);
    reporter.setOnTestCase(null);
    await vitest?.close();
  }
}
