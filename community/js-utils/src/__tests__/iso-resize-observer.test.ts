test("IsoResizeObserver", async () => {
  (globalThis as unknown as { ResizeObserver?: ResizeObserver }).ResizeObserver =
    class {} as unknown as ResizeObserver;

  const module = await import("../iso-resize-observer");
  const iso = new module.IsoResizeObserver(() => {});

  expect(iso).toMatchInlineSnapshot(`{}`);
});
