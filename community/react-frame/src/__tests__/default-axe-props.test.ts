import { frameDefaultAxe } from "../frame-default-axe.js";

describe("defaultAxeProps", () => {
  test("should have correct static string properties", () => {
    expect(frameDefaultAxe.axeResizeLabel).toBe("Resize panel");
    expect(frameDefaultAxe.axeResizeDescription).toBe(
      "Use arrow keys to resize the panel: " +
        "Up and Down arrows adjust height, " +
        "Left and Right arrows adjust width. " +
        "Or click and drag to adjust both dimensions.",
    );
    expect(frameDefaultAxe.axeMoveLabel).toBe("Draggable Area");
    expect(frameDefaultAxe.axeMoveDescription).toBe(
      "Use the arrow keys to move this component, or click and drag with the mouse",
    );
  });

  describe("axeResizeStartText", () => {
    test("should format integer dimensions correctly", () => {
      const result = frameDefaultAxe.axeResizeStartText(100, 200);
      expect(result).toBe(
        "Started resizing panel, initial size of 100 pixels wide by 200 pixels tall",
      );
    });

    test("should round decimal dimensions", () => {
      const result = frameDefaultAxe.axeResizeStartText(100.6, 200.4);
      expect(result).toBe(
        "Started resizing panel, initial size of 101 pixels wide by 200 pixels tall",
      );
    });

    test("should handle zero dimensions", () => {
      const result = frameDefaultAxe.axeResizeStartText(0, 0);
      expect(result).toBe("Started resizing panel, initial size of 0 pixels wide by 0 pixels tall");
    });
  });

  describe("axeResizeEndText", () => {
    test("should format integer dimensions correctly", () => {
      const result = frameDefaultAxe.axeResizeEndText(150, 250);
      expect(result).toBe("Panel resized to 150 pixels wide by 250 pixels tall");
    });

    test("should round decimal dimensions", () => {
      const result = frameDefaultAxe.axeResizeEndText(150.7, 250.2);
      expect(result).toBe("Panel resized to 151 pixels wide by 250 pixels tall");
    });

    test("should handle zero dimensions", () => {
      const result = frameDefaultAxe.axeResizeEndText(0, 0);
      expect(result).toBe("Panel resized to 0 pixels wide by 0 pixels tall");
    });
  });

  describe("axeMoveStartText", () => {
    test("should format integer coordinates correctly", () => {
      const result = frameDefaultAxe.axeMoveStartText(10, 20);
      expect(result).toBe(
        "Started moving from position 10 pixels from the left and 20 pixels from the top",
      );
    });

    test("should round decimal coordinates", () => {
      const result = frameDefaultAxe.axeMoveStartText(10.8, 20.3);
      expect(result).toBe(
        "Started moving from position 11 pixels from the left and 20 pixels from the top",
      );
    });

    test("should handle zero coordinates", () => {
      const result = frameDefaultAxe.axeMoveStartText(0, 0);
      expect(result).toBe(
        "Started moving from position 0 pixels from the left and 0 pixels from the top",
      );
    });

    test("should handle negative coordinates", () => {
      const result = frameDefaultAxe.axeMoveStartText(-10, -20);
      expect(result).toBe(
        "Started moving from position -10 pixels from the left and -20 pixels from the top",
      );
    });
  });

  describe("axeMoveEndText", () => {
    test("should format integer coordinates correctly", () => {
      const result = frameDefaultAxe.axeMoveEndText(30, 40);
      expect(result).toBe(
        "Move ended at position 30 pixels from the left and 40 pixels from the top",
      );
    });

    test("should round decimal coordinates", () => {
      const result = frameDefaultAxe.axeMoveEndText(30.2, 40.9);
      expect(result).toBe(
        "Move ended at position 30 pixels from the left and 41 pixels from the top",
      );
    });

    test("should handle zero coordinates", () => {
      const result = frameDefaultAxe.axeMoveEndText(0, 0);
      expect(result).toBe(
        "Move ended at position 0 pixels from the left and 0 pixels from the top",
      );
    });

    test("should handle negative coordinates", () => {
      const result = frameDefaultAxe.axeMoveEndText(-10, -20);
      expect(result).toBe(
        "Move ended at position -10 pixels from the left and -20 pixels from the top",
      );
    });
  });
});
