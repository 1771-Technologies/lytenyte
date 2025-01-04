import { render } from "@1771technologies/aio/vitest";
import { ResizeDots } from "../resize-dots";

describe("ResizeDots", () => {
  test("smoke test - renders without crashing", () => {
    const { container } = render(<ResizeDots />);

    // Verify SVG element exists with correct attributes
    const svg = container.querySelector("svg");
    expect(svg).toBeTruthy();
  });
});
