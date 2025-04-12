import type { ApiPro } from "@1771technologies/grid-types/pro";

export const frames = <D, E>(
  api: ApiPro<D, E>,
): {
  panelFrameClose: ApiPro<D, E>["panelFrameClose"];
  panelFrameOpen: ApiPro<D, E>["panelFrameOpen"];
  dialogFrameOpen: ApiPro<D, E>["dialogFrameOpen"];
  dialogFrameClose: ApiPro<D, E>["dialogFrameClose"];
  popoverFrameOpen: ApiPro<D, E>["popoverFrameOpen"];
  popoverFrameClose: ApiPro<D, E>["popoverFrameClose"];
  menuFrameOpen: ApiPro<D, E>["menuFrameOpen"];
  menuFrameClose: ApiPro<D, E>["menuFrameClose"];
} => {
  return {
    panelFrameOpen: (id, context) => {
      const s = api.getState();
      const frames = s.panelFrames.peek();
      const frame = frames[id];
      if (!frame) return;

      s.internal.panelFrameOpen.set(id);
      s.internal.panelFrameContext.set(context);
    },
    panelFrameClose: () => {
      const s = api.getState();
      s.internal.panelFrameOpen.set(null);
      s.internal.panelFrameContext.set(null);
    },

    dialogFrameOpen: (id, context) => {
      const s = api.getState();
      const frames = s.dialogFrames.peek();
      const frame = frames[id];

      if (!frame) return;

      s.internal.dialogFrameOpen.set(id);
      s.internal.dialogFrameContext.set(context);
    },
    dialogFrameClose: () => {
      const s = api.getState();
      s.internal.dialogFrameOpen.set(null);
      s.internal.dialogFrameContext.set(null);
    },

    popoverFrameOpen: (id, bb, context) => {
      const s = api.getState();
      const frames = s.popoverFrames.peek();
      const frame = frames[id];

      if (!frame) return;

      s.internal.popoverFrameOpen.set(id);
      s.internal.popoverFrameBB.set(bb);
      s.internal.popoverFrameContext.set(context);
    },
    popoverFrameClose: () => {
      const s = api.getState();
      s.internal.popoverFrameOpen.set(null);
      s.internal.popoverFrameBB.set(null);
      s.internal.popoverFrameContext.set(null);
    },

    menuFrameOpen: (id, bb, context) => {
      const s = api.getState();
      const frames = s.menuFrames.peek();
      const frame = frames[id];

      if (!frame) return;

      s.internal.menuFrameOpen.set(id);
      s.internal.menuFrameBB.set(bb);
      s.internal.menuFrameContext.set(context);
    },
    menuFrameClose: () => {
      const s = api.getState();
      s.internal.menuFrameOpen.set(null);
      s.internal.menuFrameBB.set(null);
      s.internal.menuFrameContext.set(null);
    },
  } satisfies {
    panelFrameClose: ApiPro<D, E>["panelFrameClose"];
    panelFrameOpen: ApiPro<D, E>["panelFrameOpen"];
    dialogFrameOpen: ApiPro<D, E>["dialogFrameOpen"];
    dialogFrameClose: ApiPro<D, E>["dialogFrameClose"];
    popoverFrameOpen: ApiPro<D, E>["popoverFrameOpen"];
    popoverFrameClose: ApiPro<D, E>["popoverFrameClose"];
    menuFrameOpen: ApiPro<D, E>["menuFrameOpen"];
    menuFrameClose: ApiPro<D, E>["menuFrameClose"];
  };
};
