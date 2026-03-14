import { Flex, IconButton, Text } from "@radix-ui/themes";
import { PlayIcon } from "@radix-ui/react-icons";
import type { TestNode } from "./use-run-tests.js";
import { StateIcon } from "./state-icon.js";

interface TestTreeProps {
  nodes: TestNode[];
  onRunTest: (testFullName: string) => void;
  runningTestName: string | null;
  isRunning: boolean;
  depth?: number;
}

export function TestTree({ nodes, onRunTest, runningTestName, isRunning, depth = 0 }: TestTreeProps) {
  return (
    <Flex direction="column">
      {nodes.map((node, i) => {
        const indent = depth * 16;

        if (node.kind === "suite") {
          return (
            <Flex key={i} direction="column">
              <Text
                size="2"
                weight="bold"
                color="gray"
                style={{ paddingLeft: indent, paddingTop: 8, paddingBottom: 4 }}
              >
                {node.name}
              </Text>
              <TestTree
                nodes={node.children}
                onRunTest={onRunTest}
                runningTestName={runningTestName}
                isRunning={isRunning}
                depth={depth + 1}
              />
            </Flex>
          );
        }

        const isThisTestRunning = runningTestName === node.fullName;

        return (
          <Flex key={i} direction="column" style={{ paddingLeft: indent }}>
            <Flex align="center" gap="2" py="2">
              <IconButton
                size="2"
                variant="ghost"
                loading={isThisTestRunning}
                disabled={isRunning}
                aria-label={`Run ${node.name}`}
                onClick={() => onRunTest(node.fullName)}
              >
                <PlayIcon />
              </IconButton>
              <StateIcon state={node.state} />
              <Text size="2" style={{ flexGrow: 1 }}>
                {node.name}
              </Text>
              {node.duration != null && (
                <Text size="1" color="gray">
                  {node.duration}ms
                </Text>
              )}
            </Flex>
            {node.errors.length > 0 && (
              <Flex direction="column" style={{ paddingLeft: 16, paddingBottom: 6 }}>
                {node.errors.map((err, ei) => (
                  <Text
                    key={ei}
                    size="1"
                    color="red"
                    style={{ whiteSpace: "pre-wrap", fontFamily: "monospace" }}
                  >
                    {err}
                  </Text>
                ))}
              </Flex>
            )}
          </Flex>
        );
      })}
    </Flex>
  );
}
