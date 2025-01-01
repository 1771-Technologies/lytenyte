import { getOwnerScrollbarWidth } from "../get-owner-scrollbar-width.js";

describe("getOwnerScrollbarWidth", () => {
  test("should return the correct scrollbar width", () => {
    const el = document.createElement("div");

    document.body.style.margin = "0px";

    vi.spyOn(globalThis, "innerWidth", "get").mockImplementation(() => 1000);
    vi.spyOn(globalThis.document.body, "offsetWidth", "get").mockImplementation(() => 990);

    let scrollbarWidth = getOwnerScrollbarWidth(el);
    expect(scrollbarWidth).toBe(10);

    document.body.style.margin = "2px";

    scrollbarWidth = getOwnerScrollbarWidth(el);
    expect(scrollbarWidth).toBe(6);
  });
});
