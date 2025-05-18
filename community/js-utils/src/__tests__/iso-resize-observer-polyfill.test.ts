test("IsoResizeObserver should poly", async () => {
  delete (globalThis as unknown as { ResizeObserver?: ResizeObserver }).ResizeObserver;

  const module = await import("../iso-resize-observer");
  const iso = new module.IsoResizeObserver(() => {});

  expect(iso).toMatchInlineSnapshot(`ResizeObserverServerSafe {}`);

  iso.disconnect();
  iso.unobserve(null as unknown as Element);
  iso.observe(null as unknown as Element);
});
