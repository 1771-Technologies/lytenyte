import { test } from "vitest";
import { effect, signal } from "../signal";
import { getScope, root, tick } from "../primitives";
import { removeSourceObservers } from "../remove-source-observers";

test("removeSourceObservers should do noting if the computation has no source observers", () => {
  const s = signal(23);

  const source = root(() => {
    let source: any;

    effect(() => {
      s();
      source = getScope();
    });

    return source;
  });
  tick();

  removeSourceObservers(source, 0);
  source._sources[0]._observers = null;
  removeSourceObservers(source, 0);
});
