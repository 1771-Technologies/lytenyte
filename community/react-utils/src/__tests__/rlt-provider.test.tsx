import { render, renderHook } from "@testing-library/react";
import type { PropsWithChildren } from "react";
import { RtlProvider, useIsRtl } from "../rtl-provider";

// Helper function to wrap components with RtlProvider
const wrapper = ({ children, value }: PropsWithChildren<{ value: boolean }>) => (
  <RtlProvider value={value}>{children}</RtlProvider>
);

test("should not modify the DOM structure unnecessarily", () => {
  const { container } = render(
    <RtlProvider value={false}>
      <div>Test Content</div>
    </RtlProvider>,
  );

  // Provider should not add extra DOM nodes
  expect(container.firstChild?.nodeName).toBe("DIV");
});

test("should return false when value is set to false", () => {
  const { result } = renderHook(() => useIsRtl(), {
    wrapper: ({ children }) => wrapper({ children, value: false }),
  });

  expect(result.current).toBe(false);
});

test("should return true when value is set to true", () => {
  const { result } = renderHook(() => useIsRtl(), {
    wrapper: ({ children }) => wrapper({ children, value: true }),
  });

  expect(result.current).toBe(true);
});
