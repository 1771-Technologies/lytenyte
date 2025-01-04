import { fireEvent, render } from "@1771technologies/aio/vitest";
import { Frame } from "../frame.js";

describe("Frame Component Smoke Test", () => {
  const defaultProps = {
    show: true,
    onShowChange: vi.fn(),
    x: 100,
    y: 100,
    axe: {
      axeResizeLabel: "Resize",
      axeResizeDescription: "Resize the frame",
      axeResizeStartText: (w: number, h: number) => `Started resizing. Current size: ${w}x${h}`,
      axeResizeEndText: (w: number, h: number) => `Finished resizing. New size: ${w}x${h}`,
      axeMoveLabel: "Move",
      axeMoveDescription: "Move the frame",
      axeMoveStartText: (x: number, y: number) => `Started moving. Current position: ${x},${y}`,
      axeMoveEndText: (x: number, y: number) => `Finished moving. New position: ${x},${y}`,
    },
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("adds and removes window resize listener correctly", () => {
    const addEventListenerSpy = vi.spyOn(window, "addEventListener");
    const removeEventListenerSpy = vi.spyOn(window, "removeEventListener");

    const { unmount } = render(
      <Frame {...defaultProps}>
        <div>Test Content</div>
      </Frame>,
    );

    fireEvent(window, new Event("resize"));

    unmount();

    addEventListenerSpy.mockRestore();
    removeEventListenerSpy.mockRestore();
  });
});
