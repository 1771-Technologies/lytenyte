import { isValidDate } from "../is-valid-date";

test("isValidDate", () => {
  expect(isValidDate(new Date("22aa"))).toEqual(false);
  expect(isValidDate(new Date("2023-01-01"))).toEqual(true);
});
