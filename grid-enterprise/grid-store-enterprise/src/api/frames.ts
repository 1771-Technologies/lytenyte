import type { ApiEnterprise } from "@1771technologies/grid-types";

export const frames = <D, E>(api: ApiEnterprise<D, E>) => {
  return {
    panelFrameOpen: (id) => {
      const s = api.getState();
      const frames = s.panelFrames.peek();
      const frame = frames[id];
      if (!frame) return;

      s.internal.panelFrameOpen.set(id);
    },
    panelFrameClose: () => {
      const s = api.getState();
      s.internal.panelFrameOpen.set(null);
    },

    dialogFrameClose: () => {
      const s = api.getState();
      s.internal.panelFrameOpen.set(null);
    },
    dialogFrameOpen: (id) => {
      const s = api.getState();
      const frames = s.dialogFrames.peek();
      const frame = frames[id];

      if (!frame) return;

      s.internal.panelFrameOpen.set(id);
    },
  } satisfies {
    panelFrameClose: ApiEnterprise<D, E>["panelFrameClose"];
    panelFrameOpen: ApiEnterprise<D, E>["panelFrameOpen"];
    dialogFrameOpen: ApiEnterprise<D, E>["dialogFrameOpen"];
    dialogFrameClose: ApiEnterprise<D, E>["dialogFrameClose"];
  };
};
