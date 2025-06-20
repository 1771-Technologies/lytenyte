import { describe, it, expect, vi, beforeEach } from "vitest";
import { isVirtualClick } from "../is-virtual-click.js";
import * as androidModule from "../is-android.js";

describe("isVirtualClick", () => {
  beforeEach(() => {
    vi.resetModules();
  });

  it("returns true for Firefox + JAWS/NVDA (mozInputSource === 0 and isTrusted)", () => {
    const event = {
      mozInputSource: 0,
      isTrusted: true,
    } as unknown as MouseEvent;
    expect(isVirtualClick(event)).toBe(true);
  });

  it("returns false for Firefox with isTrusted false", () => {
    const event = {
      mozInputSource: 0,
      isTrusted: false,
    } as unknown as MouseEvent;
    expect(isVirtualClick(event)).toBe(false);
  });

  it("returns true for Android TalkBack with click, pointerType defined, and buttons === 1", () => {
    vi.spyOn(androidModule, "isAndroid").mockReturnValue(true);
    const event = {
      type: "click",
      pointerType: "touch",
      buttons: 1,
    } as unknown as PointerEvent;
    expect(isVirtualClick(event)).toBe(true);
  });

  it("returns false for Android TalkBack if type is not click", () => {
    vi.spyOn(androidModule, "isAndroid").mockReturnValue(true);
    const event = {
      type: "mousedown",
      pointerType: "touch",
      buttons: 1,
    } as unknown as PointerEvent;
    expect(isVirtualClick(event)).toBe(false);
  });

  it("returns false if event.detail !== 0", () => {
    vi.spyOn(androidModule, "isAndroid").mockReturnValue(false);
    const event = {
      detail: 1,
    } as unknown as MouseEvent;
    expect(isVirtualClick(event)).toBe(false);
  });

  it("returns true if detail === 0 and no pointerType (virtual click in modern browsers)", () => {
    vi.spyOn(androidModule, "isAndroid").mockReturnValue(false);
    const event = {
      detail: 0,
    } as unknown as MouseEvent;
    expect(isVirtualClick(event)).toBe(true);
  });

  it("returns false if detail === 0 but pointerType is defined (real PointerEvent)", () => {
    vi.spyOn(androidModule, "isAndroid").mockReturnValue(false);
    const event = {
      detail: 0,
      pointerType: "mouse",
    } as unknown as PointerEvent;
    expect(isVirtualClick(event)).toBe(false);
  });
});
