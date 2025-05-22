import { expect, test, vi, beforeEach } from "vitest";
import { getElementRef } from "../get-element-ref";

// Mocked dependency
import * as reactVersionUtils from "@1771technologies/lytenyte-react-hooks";

const createElementMock = (props: any = {}, ref: any = undefined) => {
  return {
    props: { ...props },
    ref,
  };
};

beforeEach(() => {
  vi.restoreAllMocks();
});

test("getElementRef: React <=18 DEV: returns element.ref if props.ref getter has isReactWarning", () => {
  vi.spyOn(reactVersionUtils, "isReactVersionAtLeast").mockImplementation((v) => v <= 18);

  const element = createElementMock();
  const fakeGetter = () => {};
  (fakeGetter as any).isReactWarning = true;

  Object.defineProperty(element.props, "ref", {
    get: fakeGetter,
    configurable: true,
  });

  (element as any).ref = "dev-ref-18";

  const result = getElementRef(element as any);
  expect(result).toBe("dev-ref-18");
});

test("getElementRef: React >=19 DEV: returns props.ref if element.ref getter has isReactWarning", () => {
  vi.spyOn(reactVersionUtils, "isReactVersionAtLeast").mockImplementation((v) => v >= 19);

  const element = createElementMock({ ref: "ref-from-props" });
  const fakeGetter = () => {};
  (fakeGetter as any).isReactWarning = true;

  Object.defineProperty(element, "ref", {
    get: fakeGetter,
    configurable: true,
  });

  const result = getElementRef(element as any);
  expect(result).toBe("ref-from-props");
});

test("getElementRef: Fallback: returns props.ref if no dev descriptor is present", () => {
  vi.spyOn(reactVersionUtils, "isReactVersionAtLeast").mockReturnValue(false);

  const element = createElementMock({ ref: "plain-props-ref" });

  const result = getElementRef(element as any);
  expect(result).toBe("plain-props-ref");
});

test("getElementRef: Fallback: returns element.ref if props.ref is not defined", () => {
  vi.spyOn(reactVersionUtils, "isReactVersionAtLeast").mockReturnValue(false);

  const element = createElementMock({}, "fallback-element-ref");

  const result = getElementRef(element as any);
  expect(result).toBe("fallback-element-ref");
});

test("getElementRef: Returns undefined when no ref found", () => {
  vi.spyOn(reactVersionUtils, "isReactVersionAtLeast").mockReturnValue(false);

  const element = createElementMock();

  const result = getElementRef(element as any);
  expect(result).toBeUndefined();
});
