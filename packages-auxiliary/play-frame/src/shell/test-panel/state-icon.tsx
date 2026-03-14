import { CheckIcon, Cross2Icon, MinusIcon } from "@radix-ui/react-icons";
import type { TestState } from "./use-run-tests.js";

export function StateIcon({ state }: { state: TestState }) {
  if (state === "passed") return <CheckIcon style={{ color: "var(--green-9)", flexShrink: 0 }} />;
  if (state === "failed") return <Cross2Icon style={{ color: "var(--red-9)", flexShrink: 0 }} />;
  if (state === "skipped") return <MinusIcon style={{ color: "var(--gray-9)", flexShrink: 0 }} />;
  return <MinusIcon style={{ color: "var(--gray-5)", flexShrink: 0 }} />;
}
