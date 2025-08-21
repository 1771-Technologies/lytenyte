import { AccessibilityIcon, PlayIcon } from "@radix-ui/react-icons";
import { Flex, IconButton, Popover, Spinner, Tabs } from "@radix-ui/themes";
import type { AxeResults } from "axe-core";
import { useFlattenedAxeResults } from "./use-flatten-axe-results.js";
import { AxeTabContent } from "./axe-tab-content.js";

interface AxePopoverProps {
  readonly loading: boolean;
  readonly results: AxeResults | null;
  readonly runAxe: () => void;
}
export function AxePopover({ loading, results, runAxe }: AxePopoverProps) {
  const fails = useFlattenedAxeResults(results, "violations");
  const passes = useFlattenedAxeResults(results, "passes");
  const inconclusive = useFlattenedAxeResults(results, "incomplete");

  const hasFails = (fails?.length ?? 0) > 0;
  const hasIncomplete = !hasFails && (inconclusive?.length ?? 0) > 0;

  return (
    <Popover.Root modal>
      <IconButton
        disabled={loading}
        variant="soft"
        color="grass"
        style={{ marginRight: "-8px" }}
        onClick={() => runAxe()}
      >
        <PlayIcon />
      </IconButton>
      <Popover.Trigger aria-label="View accessibility report" style={{ position: "relative" }}>
        <IconButton
          disabled={loading}
          variant="soft"
          aria-label="View accessibility report"
          style={{ position: "relative" }}
        >
          {hasFails && (
            <div
              style={{
                position: "absolute",
                right: "-4px",
                top: "-4px",
                height: 12,
                width: 12,
                borderRadius: 9999,
                background: "var(--red-10)",
              }}
            />
          )}
          {hasIncomplete && (
            <div
              style={{
                position: "absolute",
                right: "-4px",
                top: "-4px",
                height: 12,
                width: 12,
                borderRadius: 9999,
                background: "var(--blue-10)",
              }}
            />
          )}
          {loading && <Spinner />}
          {!loading && <AccessibilityIcon />}
        </IconButton>
      </Popover.Trigger>
      <Popover.Content
        align="center"
        style={{ paddingTop: 8, padding: 0, overflow: "auto" }}
        maxHeight="60vh"
      >
        <Tabs.Root>
          <Tabs.List>
            <Tabs.Trigger value="failed" style={{ color: "var(--red-11)", fontWeight: "bold" }}>
              <Flex align="center" gap="2">
                Failed ({fails?.length ?? 0})
              </Flex>
            </Tabs.Trigger>
            <Tabs.Trigger
              value="inconclusive"
              style={{ color: "var(--blue-11)", fontWeight: "bold" }}
            >
              <Flex align="center" gap="2">
                Inconclusive ({inconclusive?.length ?? 0})
              </Flex>
            </Tabs.Trigger>
            <Tabs.Trigger value="passed" style={{ color: "var(--green-11)", fontWeight: "bold" }}>
              <Flex align="center" gap="2">
                Passed ({passes?.length ?? 0})
              </Flex>
            </Tabs.Trigger>
          </Tabs.List>
          <Tabs.Content value="failed">
            <AxeTabContent results={fails} />
          </Tabs.Content>
          <Tabs.Content value="passed">
            <AxeTabContent results={passes} />
          </Tabs.Content>
          <Tabs.Content value="inconclusive">
            <AxeTabContent results={inconclusive} />
          </Tabs.Content>
        </Tabs.Root>
      </Popover.Content>
    </Popover.Root>
  );
}
