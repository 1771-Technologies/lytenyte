export interface DragProperties {
  readonly x?: number;
  readonly y?: number;
  readonly dt?: DataTransfer;
}

function createTouch(el: Element, x: number, y: number): Touch {
  return new Touch({
    identifier: 0,
    target: el,
    clientX: x,
    clientY: y,
    radiusX: 1,
    radiusY: 1,
    rotationAngle: 0,
    force: 0.5,
  });
}

export const dragHandler = {
  start: (el: Element, { x, y, dt = new DataTransfer() }: DragProperties = {}) => {
    const event = new DragEvent("dragstart", {
      bubbles: true,
      cancelable: true,
      dataTransfer: dt,
      clientX: x ?? 0,
      clientY: y ?? 0,
    });
    el.dispatchEvent(event);
  },

  enter: (el: Element, { x, y, dt = new DataTransfer() }: DragProperties = {}) => {
    const bb = el.getBoundingClientRect();
    const event = new DragEvent("dragenter", {
      bubbles: true,
      cancelable: true,
      dataTransfer: dt,
      clientX: (x ?? 0) + bb.x + 1,
      clientY: (y ?? 0) + bb.y + 1,
    });
    el.dispatchEvent(event);
  },

  leave: (el: Element, { x, y, dt = new DataTransfer() }: DragProperties = {}) => {
    const event = new DragEvent("dragleave", {
      bubbles: true,
      cancelable: true,
      dataTransfer: dt,
      clientX: x ?? 0,
      clientY: y ?? 0,
    });
    el.dispatchEvent(event);
  },

  move: (el: Element, { x, y, dt = new DataTransfer() }: DragProperties = {}) => {
    const event = new DragEvent("drag", {
      bubbles: true,
      cancelable: true,
      dataTransfer: dt,
      clientX: x ?? 0,
      clientY: y ?? 0,
    });
    el.dispatchEvent(event);
  },

  over: (el: Element, { x, y, dt = new DataTransfer() }: DragProperties = {}) => {
    const bb = el.getBoundingClientRect();
    const event = new DragEvent("dragover", {
      bubbles: true,
      cancelable: true,
      dataTransfer: dt,
      clientX: (x ?? 0) + bb.x + 1,
      clientY: (y ?? 0) + bb.y + 1,
    });
    el.dispatchEvent(event);
  },

  drop: (el: Element, { x, y, dt = new DataTransfer() }: DragProperties = {}) => {
    const bb = el.getBoundingClientRect();
    const event = new DragEvent("drop", {
      bubbles: true,
      cancelable: true,
      dataTransfer: dt,
      clientX: (x ?? 0) + bb.x + 1,
      clientY: (y ?? 0) + bb.y + 1,
    });
    el.dispatchEvent(event);
  },

  end: (el: Element, { x, y, dt = new DataTransfer() }: DragProperties = {}) => {
    const event = new DragEvent("dragend", {
      bubbles: true,
      cancelable: true,
      dataTransfer: dt,
      clientX: x ?? 0,
      clientY: y ?? 0,
    });
    el.dispatchEvent(event);
  },

  touchstart: (el: Element, { x = 0, y = 0 }: DragProperties = {}) => {
    const touch = createTouch(el, x, y);
    const event = new TouchEvent("touchstart", {
      bubbles: true,
      cancelable: true,
      touches: [touch],
      targetTouches: [touch],
      changedTouches: [touch],
    });
    el.dispatchEvent(event);
  },

  touchmove: (el: Element, { x = 0, y = 0 }: DragProperties = {}) => {
    const touch = createTouch(el, x, y);
    const event = new TouchEvent("touchmove", {
      bubbles: true,
      cancelable: true,
      touches: [touch],
      targetTouches: [touch],
      changedTouches: [touch],
    });
    el.dispatchEvent(event);
  },

  touchend: (el: Element, { x = 0, y = 0 }: DragProperties = {}) => {
    const touch = createTouch(el, x, y);
    const event = new TouchEvent("touchend", {
      bubbles: true,
      cancelable: true,
      touches: [touch],
      targetTouches: [touch],
      changedTouches: [touch],
    });
    el.dispatchEvent(event);
  },

  touchcancel: (el: Element, { x = 0, y = 0 }: DragProperties = {}) => {
    const touch = createTouch(el, x, y);
    const event = new TouchEvent("touchcancel", {
      bubbles: true,
      cancelable: true,
      touches: [touch],
      targetTouches: [touch],
      changedTouches: [touch],
    });
    el.dispatchEvent(event);
  },
};
