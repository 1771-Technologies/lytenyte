import { useState } from "react";
import { Button, Flex, Link, Spinner, Switch, Tabs, Text } from "@radix-ui/themes";
import type { Demo } from "../demo-dropdown/demo-dropdown.js";
import { useRunTests } from "./use-run-tests.js";
import { SummaryBadges } from "./summary-badges.js";
import { TestResults } from "./test-results.js";
import { CoverageTree } from "./coverage-tree.js";

interface TestPanelProps {
  demo: Demo | null;
}

export function TestPanel({ demo }: TestPanelProps) {
  const filePath = demo?.filePath ?? null;
  const { status, modules, summary, error, testFiles, coverage, run, runProject, runTest, runCoverage } =
    useRunTests(filePath);

  const [touchedOnly, setTouchedOnly] = useState(false);
  const isRunning = status === "running" || status === "collecting";

  return (
    <Flex direction="column" style={{ flex: 1, minHeight: 0, overflow: "hidden" }}>
      {/* Toolbar */}
      <Flex
        px="4"
        py="3"
        gap="3"
        align="center"
        style={{ borderBottom: "1px solid var(--gray-a5)", flexShrink: 0 }}
      >
        <Button size="1" onClick={run} disabled={isRunning || !filePath}>
          {status === "running" ? (
            <Flex gap="1" align="center">
              <Spinner size="1" />
              Running…
            </Flex>
          ) : (
            "Run All"
          )}
        </Button>
        <Button size="1" variant="soft" onClick={() => runCoverage(touchedOnly)} disabled={isRunning || !filePath}>
          Coverage
        </Button>
        <Flex align="center" gap="1">
          <Switch size="1" checked={touchedOnly} onCheckedChange={setTouchedOnly} />
          <Text size="1" color="gray">Touched only</Text>
        </Flex>
        {summary && <SummaryBadges summary={summary} />}
        {error && (
          <Text size="1" color="red" style={{ whiteSpace: "pre-wrap" }}>
            {error}
          </Text>
        )}

        <Flex flexGrow="1" />

        {testFiles.length > 0 && (
          <Flex gap="3" wrap="wrap">
            {testFiles.map((f) => (
              <Link key={f} size="1" href={`vscode://file${f}`} style={{ fontFamily: "monospace" }}>
                {f.split("/").pop()}
              </Link>
            ))}
          </Flex>
        )}
      </Flex>

      {/* Inner tabs */}
      <Tabs.Root
        defaultValue="tests"
        style={{ display: "flex", flexDirection: "column", flexGrow: 1, minHeight: 0 }}
      >
        <Tabs.List style={{ flexShrink: 0 }}>
          <Tabs.Trigger value="tests">Tests</Tabs.Trigger>
          <Tabs.Trigger value="coverage" disabled={!coverage}>
            Coverage
          </Tabs.Trigger>
        </Tabs.List>

        {/* Tests tab */}
        <Tabs.Content value="tests" style={{ flexGrow: 1, overflowY: "scroll", padding: 16 }}>
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
              isRunning={status === "running"}
            />
          )}
        </Tabs.Content>

        {/* Coverage tab */}
        <Tabs.Content value="coverage" style={{ flexGrow: 1, overflowY: "scroll", padding: 16 }}>
          {coverage ? (
            <CoverageTree coverage={coverage} />
          ) : (
            <Flex align="center" justify="center" style={{ height: "100%" }}>
              <Text size="2" color="gray">
                Run coverage to see results
              </Text>
            </Flex>
          )}
        </Tabs.Content>
      </Tabs.Root>
    </Flex>
  );
}
