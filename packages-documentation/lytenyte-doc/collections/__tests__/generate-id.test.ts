import { expect, test } from "vitest";
import { generateId } from "../generate-id.js";

test("should return the correct id given entries", () => {
  expect(generateId({ entry: "index.mdx" })).toEqual("");
  expect(generateId({ entry: "./index.mdx" })).toEqual("");
  expect(generateId({ entry: "/index.mdx" })).toEqual("");
  expect(generateId({ entry: "/xcode.mdx" })).toEqual("xcode");

  expect(generateId({ entry: "one/index.mdx" })).toEqual("one");
  expect(generateId({ entry: "one/(intro)/index.mdx" })).toEqual("one");
  expect(generateId({ entry: "one/(intro)/live.mdx" })).toEqual("one/live");

  expect(generateId({ entry: "one/(@tutorial)/index.mdx" })).toEqual("one/tutorial");
  expect(generateId({ entry: "one/(@tutorial)/(01)/index.mdx" })).toEqual("one/tutorial/1");
  expect(generateId({ entry: "one/(@tutorial)/(01_setup)/index.mdx" })).toEqual(
    "one/tutorial/setup",
  );
  expect(generateId({ entry: "one/(@tutorial)/(01_setup)/01.mdx" })).toEqual(
    "one/tutorial/setup/1",
  );
  expect(generateId({ entry: "one/(@tutorial)/(01_setup)/01_fire.mdx" })).toEqual(
    "one/tutorial/setup/fire",
  );
  expect(generateId({ entry: "one/(@tutorial)/(01_setup)/01fire.mdx" })).toEqual(
    "one/tutorial/setup/1",
  );
  expect(generateId({ entry: "one/(alpha)/(@tutorial)/(01_setup)/01.mdx" })).toEqual(
    "one/tutorial/setup/1",
  );
});

test("should handle invalid error cases", () => {
  expect(() =>
    generateId({ entry: "one/(@tutorial)/(01_setup)/(alpha)/01.mdx" }),
  ).toThrowErrorMatchingInlineSnapshot(
    `[Error: Tutorial mode does not support nested subfolders.]`,
  );

  expect(() =>
    generateId({ entry: "one/(@tutorial)/(01_setup)/alpha/01.mdx" }),
  ).toThrowErrorMatchingInlineSnapshot(
    `[Error: Tutorial mode does not support nested subfolders.]`,
  );

  expect(() => {
    generateId({ entry: "one/(@tutorial)/(01_setup)/alpha.mdx" });
  }).toThrowErrorMatchingInlineSnapshot(`
    [Error: Tutorial pages should either start with a number, or be called index. 
    one/(@tutorial)/(01_setup)/alpha.mdx]
  `);

  expect(() => {
    generateId({ entry: "one/(@tutorial)/(setup)/alpha.mdx" });
  }).toThrowErrorMatchingInlineSnapshot(`
    [Error: The tutorial sections should begin with an integer value, e.g. 02. 
    one/(@tutorial)/(setup)/alpha.mdx]
  `);

  expect(() => {
    generateId({ entry: "one/(@tutorial)/01_alpha.mdx" });
  }).toThrowErrorMatchingInlineSnapshot(`
    [Error: Tutorial steps should be nested in a folder with parenthesis. 
    one/(@tutorial)/01_alpha.mdx]
  `);
});
