import { formatTable } from "../format-table";

test("should print a formatted table", () => {
  expect(
    formatTable(
      [
        ["A", "B", "C"],
        ["X", "YZEEFF", "EFEA"],
      ],
      ["Alpha", "Beta", "Sig"],
    ),
  ).toMatchInlineSnapshot(`
    "
    Alpha | Beta   | Sig 
    ---------------------
    A     | B      | C   
    X     | YZEEFF | EFEA
    "
  `);

  expect(formatTable([], ["A"])).toMatchInlineSnapshot(`""`);
});
