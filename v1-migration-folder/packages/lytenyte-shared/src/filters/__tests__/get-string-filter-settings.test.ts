import { describe, expect, test } from "vitest";
import { getStringFilterSettings } from "../get-string-filter-settings.js";
import type { FilterString } from "../../+types.js";

describe("getStringFilterSettings", () => {
  const base: FilterString = {
    kind: "string",
    operator: "equals",
    value: "",
    options: {},
  };
  test("should return the correct result", () => {
    expect(getStringFilterSettings(base)).toMatchInlineSnapshot(`
      {
        "caseInsensitive": true,
        "collator": null,
        "ignorePunctuation": false,
        "includeNulls": false,
        "locale": "en-US",
        "regex": null,
        "trimWhitespace": false,
      }
    `);

    expect(
      getStringFilterSettings({
        ...base,
        options: {
          caseInsensitive: true,
          ignorePunctuation: true,
          nullHandling: "include",
          trimWhitespace: true,
        },
      }),
    ).toMatchInlineSnapshot(`
      {
        "caseInsensitive": true,
        "collator": null,
        "ignorePunctuation": true,
        "includeNulls": true,
        "locale": "en-US",
        "regex": null,
        "trimWhitespace": true,
      }
    `);

    expect(
      getStringFilterSettings({
        ...base,
        options: {
          ignorePunctuation: true,
          nullHandling: "include",
          trimWhitespace: true,
          collation: {
            locale: "en-US",
            sensitivity: "accent",
          },
        },
      }),
    ).toMatchInlineSnapshot(`
      {
        "caseInsensitive": true,
        "collator": Collator {},
        "ignorePunctuation": true,
        "includeNulls": true,
        "locale": "en-US",
        "regex": null,
        "trimWhitespace": true,
      }
    `);

    expect(
      getStringFilterSettings({
        ...base,
        options: {
          ignorePunctuation: true,
          nullHandling: "include",
          trimWhitespace: true,
          collation: {
            locale: "en-US",
            sensitivity: "case",
          },
        },
      }),
    ).toMatchInlineSnapshot(`
      {
        "caseInsensitive": false,
        "collator": Collator {},
        "ignorePunctuation": true,
        "includeNulls": true,
        "locale": "en-US",
        "regex": null,
        "trimWhitespace": true,
      }
    `);

    // Having a value with an uppercase makes the check case sensitive
    expect(
      getStringFilterSettings({
        ...base,
        value: "Alpha",
        options: {
          ignorePunctuation: true,
          nullHandling: "include",
          trimWhitespace: true,
        },
      }),
    ).toMatchInlineSnapshot(`
      {
        "caseInsensitive": false,
        "collator": null,
        "ignorePunctuation": true,
        "includeNulls": true,
        "locale": "en-US",
        "regex": null,
        "trimWhitespace": true,
      }
    `);

    expect(
      getStringFilterSettings({
        ...base,
        value: "alpha",
        operator: "matches",
        options: {
          ignorePunctuation: true,
          nullHandling: "include",
          trimWhitespace: true,
          regexOpts: "gi",
        },
      }),
    ).toMatchInlineSnapshot(`
      {
        "caseInsensitive": true,
        "collator": null,
        "ignorePunctuation": true,
        "includeNulls": true,
        "locale": "en-US",
        "regex": /alpha/gi,
        "trimWhitespace": true,
      }
    `);

    expect(
      getStringFilterSettings({
        ...base,
        value: 123,
        operator: "matches",
        options: {
          ignorePunctuation: true,
          nullHandling: "include",
          trimWhitespace: true,
          regexOpts: "gi",
        },
      }),
    ).toMatchInlineSnapshot(`
      {
        "caseInsensitive": true,
        "collator": null,
        "ignorePunctuation": true,
        "includeNulls": true,
        "locale": "en-US",
        "regex": /123/gi,
        "trimWhitespace": true,
      }
    `);
  });
});
