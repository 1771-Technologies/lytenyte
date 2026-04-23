import { describe, test, expect } from "vitest";
import { standardPlugins } from "./standard.js";

describe("standardPlugins", () => {
  test("Should export an array of plugins", () => {
    expect(Array.isArray(standardPlugins)).toBe(true);
  });

  test("Should contain all 11 standard plugins", () => {
    expect(standardPlugins).toHaveLength(11);
  });

  test("Should contain named plugins", () => {
    const names = standardPlugins.map((p) => p.name);
    expect(names).toContain("arrows");
    expect(names).toContain("collections");
    expect(names).toContain("strings");
    expect(names).toContain("booleans");
    expect(names).toContain("comparison");
    expect(names).toContain("logical");
    expect(names).toContain("membership");
    expect(names).toContain("ternary");
    expect(names).toContain("pipe");
    expect(names).toContain("access");
    expect(names).toContain("quoted-identifier");
  });

  test("Each plugin should have a name property", () => {
    for (const plugin of standardPlugins) {
      expect(typeof plugin.name).toBe("string");
      expect(plugin.name.length).toBeGreaterThan(0);
    }
  });
});
