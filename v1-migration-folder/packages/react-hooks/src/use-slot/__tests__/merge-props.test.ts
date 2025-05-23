import { expect, test, vi } from "vitest";
import { mergeProps } from "../merge-props.js";

test("mergeProps: child props override slot props by default", () => {
  const result = mergeProps({ id: "slot-id", "data-role": "slot" }, { id: "child-id" });
  expect(result.id).toBe("child-id");
  expect(result["data-role"]).toBe("slot");
});

test("mergeProps: composes event handlers if both exist", () => {
  const slotClick = vi.fn();
  const childClick = vi.fn().mockReturnValue("child-result");

  const props = mergeProps({ onClick: slotClick }, { onClick: childClick });

  const result = props.onClick?.("arg1", "arg2");
  expect(childClick).toHaveBeenCalledWith("arg1", "arg2");
  expect(slotClick).toHaveBeenCalledWith("arg1", "arg2");
  expect(result).toBe("child-result");
});

test("mergeProps: uses slot handler if only slot has it", () => {
  const slotClick = vi.fn();
  const props = mergeProps({ onClick: slotClick }, {});

  props.onClick?.("test");
  expect(slotClick).toHaveBeenCalledWith("test");
});

test("mergeProps: uses child handler if only child has it", () => {
  const childClick = vi.fn();
  const props = mergeProps({}, { onClick: childClick });

  props.onClick?.("test");
  expect(childClick).toHaveBeenCalledWith("test");
});

test("mergeProps: merges style objects", () => {
  const result = mergeProps({ style: { color: "red", padding: 4 } }, { style: { margin: 2 } });
  expect(result.style).toEqual({
    color: "red",
    padding: 4,
    margin: 2,
  });
});

test("mergeProps: merges className strings", () => {
  const result = mergeProps({ className: "foo" }, { className: "bar" });
  expect(result.className).toBe("foo bar");
});

test("mergeProps: ignores undefined className and style", () => {
  const result = mergeProps(
    { className: undefined, style: undefined },
    { className: "child", style: { display: "block" } },
  );
  expect(result.className).toBe("child");
  expect(result.style).toEqual({ display: "block" });
});

test("mergeProps: handles non-handler props normally", () => {
  const result = mergeProps({ type: "button", disabled: true }, { disabled: false });
  expect(result.type).toBe("button");
  expect(result.disabled).toBe(false);
});
