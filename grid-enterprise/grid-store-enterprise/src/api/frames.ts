import type { ApiPro } from "@1771technologies/grid-types/pro";

export const frames = <D, E>(api: ApiPro<D, E>) => {
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
      s.internal.dialogFrameOpen.set(null);
    },
    dialogFrameOpen: (id) => {
      const s = api.getState();
      const frames = s.dialogFrames.peek();
      const frame = frames[id];

      if (!frame) return;

      s.internal.dialogFrameOpen.set(id);
    },

    popoverFrameClose: () => {
      const s = api.getState();
      s.internal.popoverFrameOpen.set(null);
      s.internal.popoverFrameBB.set(null);
    },

    popoverFrameOpen: (id, bb) => {
      const s = api.getState();
      const frames = s.popoverFrames.peek();
      const frame = frames[id];

      if (!frame) return;

      s.internal.popoverFrameOpen.set(id);
      s.internal.popoverFrameBB.set(bb);
    },
  } satisfies {
    panelFrameClose: ApiPro<D, E>["panelFrameClose"];
    panelFrameOpen: ApiPro<D, E>["panelFrameOpen"];
    dialogFrameOpen: ApiPro<D, E>["dialogFrameOpen"];
    dialogFrameClose: ApiPro<D, E>["dialogFrameClose"];
    popoverFrameOpen: ApiPro<D, E>["popoverFrameOpen"];
    popoverFrameClose: ApiPro<D, E>["popoverFrameClose"];
  };
};
