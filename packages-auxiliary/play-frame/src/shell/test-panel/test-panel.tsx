import { Button, Flex, Link, Spinner, Text } from "@radix-ui/themes";
import type { Demo } from "../demo-dropdown/demo-dropdown.js";
import { useRunTests } from "./use-run-tests.js";
import { SummaryBadges } from "./summary-badges.js";
import { TestResults } from "./test-results.js";

interface TestPanelProps {
  demo: Demo | null;
}

export function TestPanel({ demo }: TestPanelProps) {
  const filePath = demo?.filePath ?? null;
  const { status, modules, summary, error, testFiles, runningScope, run, runProject, runTest } =
    useRunTests(filePath);

  return (
    <Flex direction="column" style={{ height: "100%", overflow: "hidden" }}>
      {/* Toolbar */}
      <Flex
        px="4"
        py="3"
        gap="3"
        align="center"
        style={{ borderBottom: "1px solid var(--gray-a5)", flexShrink: 0 }}
      >
        <Button
          size="1"
          onClick={run}
          disabled={status === "running" || status === "collecting" || !filePath}
        >
          {status === "running" ? (
            <Flex gap="1" align="center">
              <Spinner size="1" />
              Running…
            </Flex>
          ) : (
            "Run All"
          )}
        </Button>
        {summary && <SummaryBadges summary={summary} />}
        {error && (
          <Text size="1" color="red" style={{ whiteSpace: "pre-wrap" }}>
            {error}
          </Text>
        )}
      </Flex>

      {/* Test file deep links */}
      {testFiles.length > 0 && (
        <Flex
          px="4"
          py="3"
          gap="3"
          wrap="wrap"
          style={{ borderBottom: "1px solid var(--gray-a5)", flexShrink: 0 }}
        >
          {testFiles.map((f) => (
            <Link key={f} size="1" href={`vscode://file${f}`} style={{ fontFamily: "monospace" }}>
              {f.split("/").pop()}
            </Link>
          ))}
        </Flex>
      )}

      {/* Results */}
      <Flex direction="column" style={{ flexGrow: 1, overflowY: "auto", padding: 16 }}>
        {modules.length === 0 && status === "collecting" && (
          <Flex align="center" justify="center" style={{ height: "100%" }}>
            <Spinner size="2" />
          </Flex>
        )}
        {modules.length === 0 && status === "idle" && (
          <Flex align="center" justify="center" style={{ height: "100%" }}>
            <Text size="2" color="gray">
              {filePath ? "No tests found" : "No play file selected"}
            </Text>
          </Flex>
        )}
        {modules.length > 0 && (
          <TestResults
            modules={modules}
            onRunProject={runProject}
            onRunTest={runTest}
            runningScope={runningScope}
            isRunning={status === "running"}
          />
        )}
      </Flex>
    </Flex>
  );
}
