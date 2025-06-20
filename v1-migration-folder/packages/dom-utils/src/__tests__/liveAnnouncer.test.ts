import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { announce, destroyAnnouncer } from "../live-announcer.js";

function getLiveAnnouncerRoot() {
  return document.querySelector('[data-live-announcer="true"]');
}

describe("LiveAnnouncer", () => {
  beforeEach(() => {
    document.body.innerHTML = "";
    destroyAnnouncer();
  });

  afterEach(() => {
    destroyAnnouncer();
  });

  it("should destroy the announcer", () => {
    announce("destroy me", "polite");
    destroyAnnouncer();
    const root = getLiveAnnouncerRoot();
    expect(root).toBeNull();
  });

  it("should reuse existing announcer without duplication", () => {
    announce("first");
    const root1 = getLiveAnnouncerRoot();
    announce("second");
    const root2 = getLiveAnnouncerRoot();
    expect(root1).toBe(root2);
  });
});
