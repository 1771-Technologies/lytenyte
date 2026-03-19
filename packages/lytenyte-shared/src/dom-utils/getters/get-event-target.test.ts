import { describe, expect, test, vi } from "vitest";
import { getEventTarget } from "./get-event-target.js";

describe("getEventTarget", () => {
  test("Should return the event target when there is no composed path", () => {
    const event = new Event("build");
    const target = document.createElement("div");
    vi.spyOn(event, "target", "get").mockImplementation(() => target);

    expect(getEventTarget(event)).toEqual(target);
  });

  test("Should return the first element in the composed path", () => {
    const event = new Event("build");
    event.composedPath = () => [target as any];
    const target = document.createElement("div");

    expect(getEventTarget(event)).toEqual(target);

    vi.resetAllMocks();

    // @ts-expect-error its fine but typing is irritating
    event.nativeEvent = { composedPath: () => [target] };

    expect(getEventTarget(event)).toEqual(target);
  });
});
