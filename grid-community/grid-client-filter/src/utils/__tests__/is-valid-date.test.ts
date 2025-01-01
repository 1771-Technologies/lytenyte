import { isValidDate } from "../is-valid-date";

test("isValidDate", () => {
  const invalidDate = new Date("234adadad");
  const invalidDate2 = new Date(undefined as unknown as Date);

  expect(isValidDate(invalidDate)).toBe(false);
  expect(isValidDate(invalidDate2)).toBe(false);

  const validDate = new Date("2022-01-01");
  expect(isValidDate(validDate)).toBe(true);
});
