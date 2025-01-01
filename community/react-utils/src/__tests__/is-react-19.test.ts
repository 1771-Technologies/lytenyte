import { isReact19 } from "../is-react-19.js";

test("should return true for react 19", () => {
  vi.mock("react", async (importOriginal) => {
    return await importOriginal();
  });

  expect(isReact19()).toEqual(true);
});
