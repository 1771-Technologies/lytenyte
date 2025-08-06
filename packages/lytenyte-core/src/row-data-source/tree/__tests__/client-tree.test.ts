import { describe, expect, test } from "vitest";
import { bankDataSmall as d } from "@1771technologies/sample-data/bank-data-smaller";
import { makeClientTree } from "../client-tree";
import { printTree } from "./print-tree";

describe("makeClientTree", () => {
  test("should create the correct flat tree", () => {
    const tree = makeClientTree({ rowData: d.slice(0, 10), rowAggModel: [], rowBranchModel: [] });

    expect(printTree(tree.root)).toMatchInlineSnapshot(`
      "
      ├── 0 |LEAF| P:root |0 | {"age":30,"j...
      ├── 1 |LEAF| P:root |0 | {"age":33,"j...
      ├── 2 |LEAF| P:root |0 | {"age":35,"j...
      ├── 3 |LEAF| P:root |0 | {"age":30,"j...
      ├── 4 |LEAF| P:root |0 | {"age":59,"j...
      ├── 5 |LEAF| P:root |0 | {"age":35,"j...
      ├── 6 |LEAF| P:root |0 | {"age":36,"j...
      ├── 7 |LEAF| P:root |0 | {"age":39,"j...
      ├── 8 |LEAF| P:root |0 | {"age":41,"j...
      ├── 9 |LEAF| P:root |0 | {"age":43,"j..."
    `);

    expect(tree.idsLeaf).toMatchInlineSnapshot(`
      Set {
        "0",
        "1",
        "2",
        "3",
        "4",
        "5",
        "6",
        "7",
        "8",
        "9",
      }
    `);
  });

  test("should create the correct grouped tree", () => {
    const tree = makeClientTree({
      rowData: d.slice(0, 15),
      rowAggModel: [],
      rowBranchModel: [{ fn: (c) => c.job }],
    });

    expect(printTree(tree.root)).toMatchInlineSnapshot(`
      "
      ├── +.+unemployed |BRANCH| P:root | 0 | {}
        ├── 0 |LEAF| P:+.+unemployed |1 | {"age":30,"j...
      ├── +.+services |BRANCH| P:root | 0 | {}
        ├── 1 |LEAF| P:+.+services |1 | {"age":33,"j...
        ├── 9 |LEAF| P:+.+services |1 | {"age":43,"j...
        ├── 10 |LEAF| P:+.+services |1 | {"age":39,"j...
      ├── +.+management |BRANCH| P:root | 0 | {}
        ├── 2 |LEAF| P:+.+management |1 | {"age":35,"j...
        ├── 3 |LEAF| P:+.+management |1 | {"age":30,"j...
        ├── 5 |LEAF| P:+.+management |1 | {"age":35,"j...
      ├── +.+blue-collar |BRANCH| P:root | 0 | {}
        ├── 4 |LEAF| P:+.+blue-collar |1 | {"age":59,"j...
        ├── 14 |LEAF| P:+.+blue-collar |1 | {"age":31,"j...
      ├── +.+self-employed |BRANCH| P:root | 0 | {}
        ├── 6 |LEAF| P:+.+self-employed |1 | {"age":36,"j...
      ├── +.+technician |BRANCH| P:root | 0 | {}
        ├── 7 |LEAF| P:+.+technician |1 | {"age":39,"j...
        ├── 12 |LEAF| P:+.+technician |1 | {"age":36,"j...
      ├── +.+entrepreneur |BRANCH| P:root | 0 | {}
        ├── 8 |LEAF| P:+.+entrepreneur |1 | {"age":41,"j...
      ├── +.+admin. |BRANCH| P:root | 0 | {}
        ├── 11 |LEAF| P:+.+admin. |1 | {"age":43,"j...
      ├── +.+student |BRANCH| P:root | 0 | {}
        ├── 13 |LEAF| P:+.+student |1 | {"age":20,"j..."
    `);

    expect(tree.idsBranch).toMatchInlineSnapshot(`
      Set {
        "+.+unemployed",
        "+.+services",
        "+.+management",
        "+.+blue-collar",
        "+.+self-employed",
        "+.+technician",
        "+.+entrepreneur",
        "+.+admin.",
        "+.+student",
      }
    `);
  });

  test("should handle aggregations on the tree correctly", () => {
    const tree = makeClientTree({
      rowData: d.slice(0, 15),
      rowAggModel: [{ name: "age", fn: (d) => d.reduce((acc, r) => acc + r.age, 0) }],
      rowBranchModel: [{ fn: (c) => c.job }],
    });

    expect(printTree(tree.root)).toMatchInlineSnapshot(`
      "
      ├── +.+unemployed |BRANCH| P:root | 0 | {"age":30}
        ├── 0 |LEAF| P:+.+unemployed |1 | {"age":30,"j...
      ├── +.+services |BRANCH| P:root | 0 | {"age":115}
        ├── 1 |LEAF| P:+.+services |1 | {"age":33,"j...
        ├── 9 |LEAF| P:+.+services |1 | {"age":43,"j...
        ├── 10 |LEAF| P:+.+services |1 | {"age":39,"j...
      ├── +.+management |BRANCH| P:root | 0 | {"age":100}
        ├── 2 |LEAF| P:+.+management |1 | {"age":35,"j...
        ├── 3 |LEAF| P:+.+management |1 | {"age":30,"j...
        ├── 5 |LEAF| P:+.+management |1 | {"age":35,"j...
      ├── +.+blue-collar |BRANCH| P:root | 0 | {"age":90}
        ├── 4 |LEAF| P:+.+blue-collar |1 | {"age":59,"j...
        ├── 14 |LEAF| P:+.+blue-collar |1 | {"age":31,"j...
      ├── +.+self-employed |BRANCH| P:root | 0 | {"age":36}
        ├── 6 |LEAF| P:+.+self-employed |1 | {"age":36,"j...
      ├── +.+technician |BRANCH| P:root | 0 | {"age":75}
        ├── 7 |LEAF| P:+.+technician |1 | {"age":39,"j...
        ├── 12 |LEAF| P:+.+technician |1 | {"age":36,"j...
      ├── +.+entrepreneur |BRANCH| P:root | 0 | {"age":41}
        ├── 8 |LEAF| P:+.+entrepreneur |1 | {"age":41,"j...
      ├── +.+admin. |BRANCH| P:root | 0 | {"age":43}
        ├── 11 |LEAF| P:+.+admin. |1 | {"age":43,"j...
      ├── +.+student |BRANCH| P:root | 0 | {"age":20}
        ├── 13 |LEAF| P:+.+student |1 | {"age":20,"j..."
    `);
  });

  test("should be able to provide custom id creators", () => {
    const tree = makeClientTree({
      rowData: d.slice(0, 15),
      rowAggModel: [{ name: "age", fn: (d) => d.reduce((acc, r) => acc + r.age, 0) }],
      rowBranchModel: [{ fn: (c) => c.job }, { fn: (c) => c.default }],
      rowIdLeaf: (d, i) => `${i}-${d.age}`,
      rowIdGroup: (p) => p.join("-->"),
    });

    expect(printTree(tree.root)).toMatchInlineSnapshot(`
      "
      ├── unemployed |BRANCH| P:root | 0 | {"age":30}
        ├── unemployed-->no |BRANCH| P:unemployed | 1 | {"age":30}
          ├── 0-30 |LEAF| P:unemployed-->no |2 | {"age":30,"j...
      ├── services |BRANCH| P:root | 0 | {"age":115}
        ├── services-->no |BRANCH| P:services | 1 | {"age":115}
          ├── 1-33 |LEAF| P:services-->no |2 | {"age":33,"j...
          ├── 9-43 |LEAF| P:services-->no |2 | {"age":43,"j...
          ├── 10-39 |LEAF| P:services-->no |2 | {"age":39,"j...
      ├── management |BRANCH| P:root | 0 | {"age":100}
        ├── management-->no |BRANCH| P:management | 1 | {"age":100}
          ├── 2-35 |LEAF| P:management-->no |2 | {"age":35,"j...
          ├── 3-30 |LEAF| P:management-->no |2 | {"age":30,"j...
          ├── 5-35 |LEAF| P:management-->no |2 | {"age":35,"j...
      ├── blue-collar |BRANCH| P:root | 0 | {"age":90}
        ├── blue-collar-->no |BRANCH| P:blue-collar | 1 | {"age":90}
          ├── 4-59 |LEAF| P:blue-collar-->no |2 | {"age":59,"j...
          ├── 14-31 |LEAF| P:blue-collar-->no |2 | {"age":31,"j...
      ├── self-employed |BRANCH| P:root | 0 | {"age":36}
        ├── self-employed-->no |BRANCH| P:self-employed | 1 | {"age":36}
          ├── 6-36 |LEAF| P:self-employed-->no |2 | {"age":36,"j...
      ├── technician |BRANCH| P:root | 0 | {"age":75}
        ├── technician-->no |BRANCH| P:technician | 1 | {"age":75}
          ├── 7-39 |LEAF| P:technician-->no |2 | {"age":39,"j...
          ├── 12-36 |LEAF| P:technician-->no |2 | {"age":36,"j...
      ├── entrepreneur |BRANCH| P:root | 0 | {"age":41}
        ├── entrepreneur-->no |BRANCH| P:entrepreneur | 1 | {"age":41}
          ├── 8-41 |LEAF| P:entrepreneur-->no |2 | {"age":41,"j...
      ├── admin. |BRANCH| P:root | 0 | {"age":43}
        ├── admin.-->no |BRANCH| P:admin. | 1 | {"age":43}
          ├── 11-43 |LEAF| P:admin.-->no |2 | {"age":43,"j...
      ├── student |BRANCH| P:root | 0 | {"age":20}
        ├── student-->no |BRANCH| P:student | 1 | {"age":20}
          ├── 13-20 |LEAF| P:student-->no |2 | {"age":20,"j..."
    `);
  });

  test("should handle multiple group paths", () => {
    const tree = makeClientTree({
      rowData: d.slice(0, 15),
      rowAggModel: [{ name: "age", fn: (d) => d.reduce((acc, r) => acc + r.age, 0) }],
      rowBranchModel: [{ fn: (c) => c.job }, { fn: (c) => c.default }, { fn: () => undefined }],
    });

    expect(printTree(tree.root)).toMatchInlineSnapshot(`
      "
      ├── +.+unemployed |BRANCH| P:root | 0 | {"age":30}
        ├── +.+unemployed/no |BRANCH| P:+.+unemployed | 1 | {"age":30}
          ├── +.+unemployed/no/<__null__> |BRANCH| P:+.+unemployed/no | 2 | {"age":30}
            ├── 0 |LEAF| P:+.+unemployed/no/<__null__> |3 | {"age":30,"j...
      ├── +.+services |BRANCH| P:root | 0 | {"age":115}
        ├── +.+services/no |BRANCH| P:+.+services | 1 | {"age":115}
          ├── +.+services/no/<__null__> |BRANCH| P:+.+services/no | 2 | {"age":115}
            ├── 1 |LEAF| P:+.+services/no/<__null__> |3 | {"age":33,"j...
            ├── 9 |LEAF| P:+.+services/no/<__null__> |3 | {"age":43,"j...
            ├── 10 |LEAF| P:+.+services/no/<__null__> |3 | {"age":39,"j...
      ├── +.+management |BRANCH| P:root | 0 | {"age":100}
        ├── +.+management/no |BRANCH| P:+.+management | 1 | {"age":100}
          ├── +.+management/no/<__null__> |BRANCH| P:+.+management/no | 2 | {"age":100}
            ├── 2 |LEAF| P:+.+management/no/<__null__> |3 | {"age":35,"j...
            ├── 3 |LEAF| P:+.+management/no/<__null__> |3 | {"age":30,"j...
            ├── 5 |LEAF| P:+.+management/no/<__null__> |3 | {"age":35,"j...
      ├── +.+blue-collar |BRANCH| P:root | 0 | {"age":90}
        ├── +.+blue-collar/no |BRANCH| P:+.+blue-collar | 1 | {"age":90}
          ├── +.+blue-collar/no/<__null__> |BRANCH| P:+.+blue-collar/no | 2 | {"age":90}
            ├── 4 |LEAF| P:+.+blue-collar/no/<__null__> |3 | {"age":59,"j...
            ├── 14 |LEAF| P:+.+blue-collar/no/<__null__> |3 | {"age":31,"j...
      ├── +.+self-employed |BRANCH| P:root | 0 | {"age":36}
        ├── +.+self-employed/no |BRANCH| P:+.+self-employed | 1 | {"age":36}
          ├── +.+self-employed/no/<__null__> |BRANCH| P:+.+self-employed/no | 2 | {"age":36}
            ├── 6 |LEAF| P:+.+self-employed/no/<__null__> |3 | {"age":36,"j...
      ├── +.+technician |BRANCH| P:root | 0 | {"age":75}
        ├── +.+technician/no |BRANCH| P:+.+technician | 1 | {"age":75}
          ├── +.+technician/no/<__null__> |BRANCH| P:+.+technician/no | 2 | {"age":75}
            ├── 7 |LEAF| P:+.+technician/no/<__null__> |3 | {"age":39,"j...
            ├── 12 |LEAF| P:+.+technician/no/<__null__> |3 | {"age":36,"j...
      ├── +.+entrepreneur |BRANCH| P:root | 0 | {"age":41}
        ├── +.+entrepreneur/no |BRANCH| P:+.+entrepreneur | 1 | {"age":41}
          ├── +.+entrepreneur/no/<__null__> |BRANCH| P:+.+entrepreneur/no | 2 | {"age":41}
            ├── 8 |LEAF| P:+.+entrepreneur/no/<__null__> |3 | {"age":41,"j...
      ├── +.+admin. |BRANCH| P:root | 0 | {"age":43}
        ├── +.+admin./no |BRANCH| P:+.+admin. | 1 | {"age":43}
          ├── +.+admin./no/<__null__> |BRANCH| P:+.+admin./no | 2 | {"age":43}
            ├── 11 |LEAF| P:+.+admin./no/<__null__> |3 | {"age":43,"j...
      ├── +.+student |BRANCH| P:root | 0 | {"age":20}
        ├── +.+student/no |BRANCH| P:+.+student | 1 | {"age":20}
          ├── +.+student/no/<__null__> |BRANCH| P:+.+student/no | 2 | {"age":20}
            ├── 13 |LEAF| P:+.+student/no/<__null__> |3 | {"age":20,"j..."
    `);

    expect(tree.idsBranch).toMatchInlineSnapshot(`
      Set {
        "+.+unemployed",
        "+.+unemployed/no",
        "+.+unemployed/no/<__null__>",
        "+.+services",
        "+.+services/no",
        "+.+services/no/<__null__>",
        "+.+management",
        "+.+management/no",
        "+.+management/no/<__null__>",
        "+.+blue-collar",
        "+.+blue-collar/no",
        "+.+blue-collar/no/<__null__>",
        "+.+self-employed",
        "+.+self-employed/no",
        "+.+self-employed/no/<__null__>",
        "+.+technician",
        "+.+technician/no",
        "+.+technician/no/<__null__>",
        "+.+entrepreneur",
        "+.+entrepreneur/no",
        "+.+entrepreneur/no/<__null__>",
        "+.+admin.",
        "+.+admin./no",
        "+.+admin./no/<__null__>",
        "+.+student",
        "+.+student/no",
        "+.+student/no/<__null__>",
      }
    `);
  });
});
