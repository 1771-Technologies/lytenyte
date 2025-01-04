import { upperCaseFirstLetter } from "../upper-case-first-letter.js";

test("should upper case the first letter", () => {
  expect(upperCaseFirstLetter("alpha")).toEqual("Alpha");
  expect(upperCaseFirstLetter("1fdfedf")).toEqual("1fdfedf");
});
