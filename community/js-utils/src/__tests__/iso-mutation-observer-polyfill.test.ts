test("IsoMutationObserver should poly", async () => {
  delete (globalThis as unknown as { MutationObserver?: MutationObserver }).MutationObserver;

  const module = await import("../iso-mutation-observer");
  const iso = new module.IsoMutationObserver(() => {});

  expect(iso).toMatchInlineSnapshot(`MutationObserverServerSafe {}`);

  iso.disconnect();
  iso.observe(null as unknown as Node, null as unknown as MutationObserverInit);
});
