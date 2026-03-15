import { Badge, Flex, Text } from "@radix-ui/themes";
import type { TestSummary } from "./use-run-tests.js";

export function SummaryBadges({ summary }: { summary: TestSummary }) {
  return (
    <Flex gap="2" align="center">
      {summary.numPassed > 0 && <Badge color="green">{summary.numPassed} passed</Badge>}
      {summary.numFailed > 0 && <Badge color="red">{summary.numFailed} failed</Badge>}
      <Text size="1" color="gray">
        {summary.numTotal} total
      </Text>
    </Flex>
  );
}
