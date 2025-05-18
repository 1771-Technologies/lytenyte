import { render, screen } from "@1771technologies/aio/vitest";
import { useRef } from "react";
import { refCompat } from "../ref-compat.js";

test("should forward refs correctly", () => {
  // Create a test component
  const TestComponent = refCompat<HTMLDivElement>(({ ref }) => (
    <div ref={ref} data-testid="test">
      Test
    </div>
  ));

  // Create a component that uses the ref
  const WrapperComponent = () => {
    const ref = useRef<HTMLDivElement>(null);
    return <TestComponent ref={ref} />;
  };

  // Render and verify
  render(<WrapperComponent />);
  const element = screen.getByTestId("test");
  expect(element).toBeTruthy();
});

test("should pass through props correctly", () => {
  // Create a test component with props
  const TestComponent = refCompat<HTMLButtonElement, { label: string }>(({ label, ref }) => (
    <button ref={ref} data-testid="test">
      {label}
    </button>
  ));

  // Render with props
  const { rerender } = render(<TestComponent label="Click me" />);
  expect(screen.getByText("Click me")).toBeTruthy();

  // Test prop updates
  rerender(<TestComponent label="New label" />);
  expect(screen.getByText("New label")).toBeTruthy();
});

test("should set display name correctly", () => {
  const TestComponent = refCompat(({ ref }) => <div ref={ref} />, "CustomName");

  expect(TestComponent.displayName).toBe("CustomName");
});

test("should work with null refs", () => {
  const TestComponent = refCompat<HTMLDivElement>(({ ref }) => (
    <div ref={ref} data-testid="test" />
  ));

  expect(() => render(<TestComponent ref={null} />)).not.toThrow();
});
