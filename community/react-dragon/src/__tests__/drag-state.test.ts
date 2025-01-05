import { dragState } from "../drag-state";

test("drag state should have the correct values", () => {
  expect(dragState.store.activeTags.peek()).toMatchInlineSnapshot(`null`);
  expect(dragState.store.dragActive.peek()).toMatchInlineSnapshot(`false`);
  expect(dragState.store.dragData.peek()).toMatchInlineSnapshot(`[Function]`);
  expect(dragState.store.overTags.peek()).toMatchInlineSnapshot(`null`);
});
