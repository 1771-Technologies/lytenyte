import type { BlockPayload } from "../../types.js";
import { blockStoreTruncatePayloadIfNecessary } from "../block-store-truncate-payload-if-necessary.js";
import { makeRowNodes } from "./make-row-nodes.js";

test("should truncate the payload if there are more nodes than desired", () => {
  const payload: BlockPayload = {
    data: makeRowNodes([
      [1, ""],
      [1, ""],
      [1, ""],
      [1, ""],
      [1, ""],
    ]),
    index: 2,
    path: "alpha",
  };

  const err = console.error;
  console.error = vi.fn();
  const results = blockStoreTruncatePayloadIfNecessary(payload, 3);
  expect(results).toMatchInlineSnapshot(`
    [
      {
        "kind": 1,
        "pathKey": "",
      },
      {
        "kind": 1,
        "pathKey": "",
      },
      {
        "kind": 1,
        "pathKey": "",
      },
    ]
  `);
  expect(console.error).toHaveBeenCalledOnce();
  console.error = err;
});

test("should not truncate if the nodes fit fine", () => {
  const payload: BlockPayload = {
    data: makeRowNodes([
      [1, ""],
      [1, ""],
      [1, ""],
      [1, ""],
    ]),
    index: 2,
    path: "al",
  };

  const results = blockStoreTruncatePayloadIfNecessary(payload, 4);

  expect(results).toEqual(payload.data);
});
