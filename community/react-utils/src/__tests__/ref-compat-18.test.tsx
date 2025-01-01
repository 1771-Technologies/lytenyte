import { render, screen } from "@1771technologies/aio/vitest";

import { refCompat } from "../ref-compat.js";
import * as R from "../is-react-19.js";

test("should pass through props correctly", () => {
  vi.spyOn(R, "isReact19").mockImplementationOnce(() => false);
  // Create a test component with props
  const TestComponent = refCompat<HTMLButtonElement, { label: string }>(
    ({ label, ref }) => (
      <button ref={ref} data-testid="test">
        {label}
      </button>
    ),
    "alpha",
  );

  // Render with props
  const { rerender } = render(<TestComponent label="Click me" />);
  expect(screen.getByText("Click me")).toBeTruthy();

  // Test prop updates
  rerender(<TestComponent label="New label" />);
  expect(screen.getByText("New label")).toBeTruthy();
});
