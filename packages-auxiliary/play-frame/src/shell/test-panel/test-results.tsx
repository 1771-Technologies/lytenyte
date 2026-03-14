import { Badge, Flex, IconButton, Text } from "@radix-ui/themes";
import { PlayIcon } from "@radix-ui/react-icons";
import type { RunningScope, TestFileResult } from "./use-run-tests.js";
import { TestTree } from "./test-tree.js";
import { projectCounts } from "./project-counts.js";

interface TestResultsProps {
  modules: TestFileResult[];
  onRunProject: (projectName: string) => void;
  onRunTest: (testName: string, projectName: string) => void;
  runningScope: RunningScope | null;
  isRunning: boolean;
}

export function TestResults({ modules, onRunProject, onRunTest, runningScope, isRunning }: TestResultsProps) {
  const byProject = new Map<string, TestFileResult[]>();
  for (const mod of modules) {
    if (!byProject.has(mod.projectName)) byProject.set(mod.projectName, []);
    byProject.get(mod.projectName)!.push(mod);
  }

  const multipleProjects = byProject.size > 1;

  return (
    <Flex direction="column" gap="5">
      {[...byProject.entries()].map(([projectName, mods]) => {
        const isProjectRunning =
          runningScope?.kind === "project" && runningScope.projectName === projectName;

        const runningTestName =
          runningScope?.kind === "test" && runningScope.projectName === projectName
            ? runningScope.name
            : null;

        const { total, passed, failed } = projectCounts(mods);

        return (
          <Flex key={projectName} direction="column" gap="3">
            <Flex align="center" gap="2">
              {multipleProjects && (
                <Text
                  size="2"
                  weight="bold"
                  color="violet"
                  style={{ textTransform: "uppercase", letterSpacing: "0.06em" }}
                >
                  {projectName}
                </Text>
              )}
              <IconButton
                size="2"
                variant="ghost"
                loading={isProjectRunning}
                disabled={isRunning}
                aria-label={`Run all tests in ${projectName}`}
                onClick={() => onRunProject(projectName)}
              >
                <PlayIcon />
              </IconButton>
              {passed > 0 && <Badge color="green">{passed} passed</Badge>}
              {failed > 0 && <Badge color="red">{failed} failed</Badge>}
              <Text size="1" color="gray">
                {total} total
              </Text>
            </Flex>

            {mods.map((mod) => (
              <TestTree
                key={`${mod.projectName}:${mod.filepath}`}
                nodes={mod.nodes}
                onRunTest={(testName) => onRunTest(testName, mod.projectName)}
                runningTestName={runningTestName}
                isRunning={isRunning}
              />
            ))}
          </Flex>
        );
      })}
    </Flex>
  );
}
