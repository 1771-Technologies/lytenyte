import { getClientX, getClientY } from "../get-client-xy.js";

describe("getClientX", () => {
  test("should return clientX for MouseEvent", () => {
    const mouseEvent = {
      clientX: 100,
      clientY: 200,
    };
    expect(getClientX(mouseEvent as MouseEvent)).toBe(100);
  });

  test("should return clientX for PointerEvent", () => {
    const pointerEvent = {
      clientX: 150,
      clientY: 250,
    };
    expect(getClientX(pointerEvent as PointerEvent)).toBe(150);
  });

  test("should return clientX for DragEvent", () => {
    const dragEvent = {
      clientX: 200,
      clientY: 300,
    };
    expect(getClientX(dragEvent as DragEvent)).toBe(200);
  });

  test("should return first touch clientX for TouchEvent", () => {
    const touchEvent = {
      touches: [
        {
          clientX: 300,
          clientY: 400,
        },
      ],
    };
    expect(getClientX(touchEvent as unknown as TouchEvent)).toBe(300);
  });
});

describe("getClientY", () => {
  test("should return clientY for MouseEvent", () => {
    const mouseEvent = {
      clientX: 100,
      clientY: 200,
    };
    expect(getClientY(mouseEvent as MouseEvent)).toBe(200);
  });

  test("should return clientY for PointerEvent", () => {
    const pointerEvent = {
      clientX: 150,
      clientY: 250,
    };
    expect(getClientY(pointerEvent as PointerEvent)).toBe(250);
  });

  test("should return clientY for DragEvent", () => {
    const dragEvent = {
      clientX: 200,
      clientY: 300,
    };
    expect(getClientY(dragEvent as DragEvent)).toBe(300);
  });

  test("should return first touch clientY for TouchEvent", () => {
    const touchEvent = {
      touches: [
        {
          clientX: 300,
          clientY: 400,
        },
      ],
    };
    expect(getClientY(touchEvent as unknown as TouchEvent)).toBe(400);
  });
});
