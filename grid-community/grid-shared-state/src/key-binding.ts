import type { ApiCommunity, ApiEnterprise } from "@1771technologies/grid-types";
import type { KeyBindingString } from "@1771technologies/grid-types/community";

function getKey(event: KeyboardEvent) {
  if (event.code === "Space") return "space";
  return event.key.toLowerCase();
}

function callKeyWithEvent<D, E>(
  api: ApiEnterprise<D, E> | ApiCommunity<D, E>,
  event: KeyboardEvent,
) {
  const key = getKey(event);
  const ctrl = event.ctrlKey;
  const cmd = event.metaKey;
  const shift = event.shiftKey;

  if (cmd && ctrl) return;

  const keyCalled =
    `${cmd ? "cmd-" : ""}${ctrl ? "ctrl-" : ""}${shift ? "shift-" : ""}${key}` as KeyBindingString;

  if (callKey(api, keyCalled)) event.preventDefault();
}

function callKey<D, E>(api: ApiEnterprise<D, E> | ApiCommunity<D, E>, key: KeyBindingString) {
  const bindings = api.getState().keyBindings.peek();

  const keys = bindings[key];
  if (!keys) return;

  let called = false;
  for (const binding of keys) {
    if (binding.when && !binding.when(api as any)) continue;
    binding.action(api as any);
    called = true;
    break;
  }

  return called;
}

export const keyBindingCall = <D, E>(
  api: ApiEnterprise<D, E> | ApiCommunity<D, E>,
  k: KeyBindingString,
) => {
  callKey(api, k);
  (api as any).eventFire("onKey", api);
};

export const keyBindingCallWithEvent = <D, E>(
  api: ApiEnterprise<D, E> | ApiCommunity<D, E>,
  event: KeyboardEvent,
) => {
  callKeyWithEvent(api, event);
  (api as any).eventFire("onKey", api);
};
