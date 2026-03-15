import { Flex, IconButton, Spinner, Text } from "@radix-ui/themes";
import { PlayIcon } from "@radix-ui/react-icons";
import type { TestNode } from "./use-run-tests.js";
import { StateIcon } from "./state-icon.js";
import Convert from "ansi-to-html";

const ansiConvert = new Convert({ escapeXML: true });

interface TestTreeProps {
  nodes: TestNode[];
  onRunTest: (testFullName: string) => void;
  isRunning: boolean;
  depth?: number;
}

export function TestTree({ nodes, onRunTest, isRunning, depth = 0 }: TestTreeProps) {
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
                isRunning={isRunning}
                depth={depth + 1}
              />
            </Flex>
          );
        }

        return (
          <Flex key={i} direction="column" style={{ paddingLeft: indent }}>
            <Flex align="center" gap="2" py="2">
              <IconButton
                size="2"
                variant="ghost"
                disabled={isRunning}
                aria-label={`Run ${node.name}`}
                onClick={() => onRunTest(node.fullName)}
              >
                <PlayIcon />
              </IconButton>
              {node.state === "running" ? (
                <Spinner size="1" style={{ flexShrink: 0, width: 16, height: 16 }} />
              ) : (
                <StateIcon state={node.state} />
              )}
              <Text size="2" style={{ flexGrow: 1 }}>
                {node.name}
              </Text>
              {node.duration != null && (
                <Text size="1" color="gray">
                  {Math.round(node.duration)}ms
                </Text>
              )}
            </Flex>
            {node.errors.length > 0 && (
              <Flex direction="column" gap="2" style={{ paddingLeft: 16, paddingBottom: 6 }}>
                {node.errors.map((err, ei) => (
                  <pre
                    key={ei}
                    className="play-error-block"
                    dangerouslySetInnerHTML={{ __html: ansiConvert.toHtml(err) }}
                  />
                ))}
              </Flex>
            )}
          </Flex>
        );
      })}
    </Flex>
  );
}
