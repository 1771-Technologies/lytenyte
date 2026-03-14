import { CheckIcon, Cross2Icon, MinusIcon } from "@radix-ui/react-icons";
import type { TestState } from "./use-run-tests.js";

const ICON_STYLE = { flexShrink: 0, width: 16, height: 16 } as const;

export function StateIcon({ state }: { state: TestState }) {
  if (state === "passed") return <CheckIcon style={{ ...ICON_STYLE, color: "var(--green-9)" }} />;
  if (state === "failed") return <Cross2Icon style={{ ...ICON_STYLE, color: "var(--red-9)" }} />;
  if (state === "skipped") return <MinusIcon style={{ ...ICON_STYLE, color: "var(--gray-9)" }} />;
  return <MinusIcon style={{ ...ICON_STYLE, color: "var(--gray-5)" }} />;
}
