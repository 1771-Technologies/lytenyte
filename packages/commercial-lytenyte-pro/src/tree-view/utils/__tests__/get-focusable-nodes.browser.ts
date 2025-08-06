import { describe, expect, test } from "vitest";
import { append, html } from "./test-utils";
import { getFocusableNodes } from "../get-focusable-nodes";

describe("getFocusableNodes", () => {
  test("should return the correct nodes", () => {
    append(html`
      <div id="panel">
        <div data-ln-tree-node="true" />
        <div data-ln-tree-node="true" />
        <div data-ln-tree-node="true" />
      </div>
    `);

    const panel = document.getElementById("panel")!;

    panel.childNodes.forEach((c) => {
      (c as HTMLElement).tabIndex = -1;
    });

    const nodes = getFocusableNodes(document.getElementById("panel")!);
    expect(nodes).toHaveLength(3);
  });
});
