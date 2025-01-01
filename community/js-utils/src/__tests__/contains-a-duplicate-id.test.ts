import { containsADuplicateId } from "../contains-a-duplicate-id.js";

test("containsADuplicateId", () => {
  const ids = [{ id: "x" }, { id: "y" }, { id: "z" }];
  expect(containsADuplicateId(ids)).toEqual(false);
  expect(containsADuplicateId([...ids, { id: "y" }])).toEqual(true);
});
