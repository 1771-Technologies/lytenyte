import { describe, expect, test, vi } from "vitest";
import { standardPreventScroll } from "./standard-prevent-scroll.js";
import { wait } from "@1771technologies/js-utils";

describe("standardPreventScroll", () => {
  test("Should handle webkit with viewport scroll", async () => {
    vi.spyOn(CSS, "supports").mockImplementationOnce(() => true);
    vi.spyOn(window, "visualViewport", "get").mockImplementationOnce(() => ({ scale: 2 }) as any);

    expect(standardPreventScroll(document.documentElement)).toEqual(null);
    await wait();

    vi.spyOn(CSS, "supports").mockImplementationOnce(() => true);
    vi.spyOn(window, "visualViewport", "get").mockImplementationOnce(() => ({ scale: undefined }) as any);

    const res = standardPreventScroll(document.documentElement);
    expect(res).not.toEqual(null);
    res?.();
    await wait();
  });

  test("Should handle locking the scroll", async () => {
    const cleanup = standardPreventScroll(document.documentElement);

    await wait();
    expect(document.documentElement.getAttribute("data-ln-scroll-locked")).toEqual("");
    cleanup?.();
    await wait();
    expect(document.documentElement.getAttribute("data-ln-scroll-locked")).toEqual(null);
  });

  test("Should handle resizes", async () => {
    const cleanup = standardPreventScroll(document.documentElement);
    await wait();
    expect(document.documentElement.getAttribute("data-ln-scroll-locked")).toEqual("");

    window.dispatchEvent(new Event("resize"));

    cleanup?.();
    await wait();
  });

  test("Should set overflowY and overflowX to scroll when scrollbar-gutter is unsupported and content has constant overflow", async () => {
    vi.spyOn(CSS, "supports").mockReturnValue(false);
    document.body.style.overflowY = "scroll";
    document.body.style.overflowX = "scroll";

    const cleanup = standardPreventScroll(document.documentElement);
    await wait();

    expect(document.documentElement.style.overflowY).toEqual("scroll");
    expect(document.documentElement.style.overflowX).toEqual("scroll");

    cleanup?.();
    await wait();

    document.body.style.overflowY = "";
    document.body.style.overflowX = "";
  });

  test("Should use calc for height and width when body has no margins but scrollbar dimensions are non-zero", async () => {
    vi.spyOn(CSS, "supports").mockReturnValue(false);

    vi.spyOn(window, "innerHeight", "get").mockReturnValue(9999);
    vi.spyOn(window, "innerWidth", "get").mockReturnValue(9999);
    document.body.style.margin = "0";

    const cleanup = standardPreventScroll(document.documentElement);
    await wait();

    expect(document.body.style.height).toMatch(/calc\(.*100dvh.*\)/);
    expect(document.body.style.width).toMatch(/calc\(.*100vw.*\)/);

    cleanup?.();
    await wait();

    document.body.style.margin = "";
  });

  test("Should set height to 100dvh and width to 100vw when body has no margins and scrollbar dimensions are zero", async () => {
    vi.spyOn(window, "innerHeight", "get").mockReturnValue(0);
    vi.spyOn(window, "innerWidth", "get").mockReturnValue(0);
    document.body.style.margin = "0";

    const cleanup = standardPreventScroll(document.documentElement);
    await wait();

    expect(document.body.style.height).toEqual("100dvh");
    expect(document.body.style.width).toEqual("100vw");

    cleanup?.();
    await wait();

    document.body.style.margin = "";
  });
});
