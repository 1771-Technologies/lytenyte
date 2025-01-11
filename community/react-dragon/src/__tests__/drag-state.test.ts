import { dragState } from "../drag-state";

test("drag state should have the correct values", () => {
  expect(dragState.activeTags.peek()).toMatchInlineSnapshot(`null`);
  expect(dragState.dragActive.peek()).toMatchInlineSnapshot(`false`);
  expect(dragState.dragData.peek()).toMatchInlineSnapshot(`[Function]`);
  expect(dragState.overTags.peek()).toMatchInlineSnapshot(`null`);
});
