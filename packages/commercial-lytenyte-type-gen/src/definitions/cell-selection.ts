import type { UnionType } from "../+types.js";

export const CellSelectionMode: UnionType = {
  kind: "union",
  tsDoc: `
  Specifies the available modes for cell selection in LyteNyte Grid. 

  This is a **PRO-only** feature that controls how users can interact with and select cells:

  - \`"range"\`: Allows a single rectangular selection of cells.
  - \`"multi-range"\`: Enables multiple, possibly overlapping, independent cell selections.
  - \`"none"\`: Disables all cell selection interactions.

  Useful for enabling features like copy-paste, cell highlighting, and keyboard navigation.

  @group Cell Selection
  `,
  doc: { en: `` },
  export: true,
  name: "CellSelectionMode",
  types: ['"range"', '"multi-range"', '"none"'],
  tag: "pro",
};
