import { test } from "vitest";
import { effect, signal } from "../signal.js";
import { getScope, root, tick } from "../primitives.js";
import { removeSourceObservers } from "../remove-source-observers.js";

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
