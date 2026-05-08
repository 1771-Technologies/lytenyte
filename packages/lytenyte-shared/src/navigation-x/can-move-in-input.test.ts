import { describe, expect, test, vi } from "vitest";
import { canMoveInInput } from "./can-move-in-input.js";

describe("canMoveInInput", () => {
  test("Should be able to move in the input", () => {
    const input = document.createElement("input");
    input.value = "hello";

    vi.spyOn(input, "selectionStart", "get").mockImplementationOnce(() => null);
    expect(canMoveInInput(input)).toMatchInlineSnapshot(`
      {
        "end": false,
        "start": false,
      }
    `);

    vi.spyOn(input, "selectionStart", "get").mockImplementationOnce(() => 1);
    expect(canMoveInInput(input)).toMatchInlineSnapshot(`
      {
        "end": false,
        "start": false,
      }
    `);
    vi.spyOn(input, "selectionStart", "get").mockImplementationOnce(() => 0);
    expect(canMoveInInput(input)).toMatchInlineSnapshot(`
      {
        "end": false,
        "start": true,
      }
    `);
    vi.spyOn(input, "selectionStart", "get").mockImplementationOnce(() => 5);
    expect(canMoveInInput(input)).toMatchInlineSnapshot(`
      {
        "end": true,
        "start": false,
      }
    `);
    vi.spyOn(input, "selectionStart", "get").mockImplementationOnce(() => 5);
    expect(canMoveInInput(input)).toMatchInlineSnapshot(`
      {
        "end": true,
        "start": false,
      }
    `);

    input.value = "";
    vi.spyOn(input, "selectionStart", "get").mockImplementationOnce(() => 0);
    expect(canMoveInInput(input)).toMatchInlineSnapshot(`
      {
        "end": true,
        "start": true,
      }
    `);

    vi.spyOn(input, "selectionStart", "get").mockImplementationOnce(() => 11);
    expect(canMoveInInput(input)).toMatchInlineSnapshot(`
      {
        "end": false,
        "start": false,
      }
    `);
  });
});
