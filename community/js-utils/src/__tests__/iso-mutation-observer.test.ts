test("IsoMutationObserver should work fine", async () => {
  const module = await import("../iso-mutation-observer");
  const iso = new module.IsoMutationObserver(() => {});

  expect(iso).toMatchInlineSnapshot(`MutationObserver {}`);
});
