import { describe, expect, test } from "vitest";
import { columnAddMarker } from "../column-add-marker.js";

describe("columnAddMarker", () => {
  test("should add the marker column when the marker is enabled", () => {
    const columns = [{ id: "x" }];

    expect(columnAddMarker({ columns, marker: {}, markerEnabled: true })).toMatchInlineSnapshot(`
      [
        {
          "id": "lytenyte-marker-column",
          "name": "",
          "pin": "start",
          "width": 30,
          "widthMin": 24,
        },
        {
          "id": "x",
        },
      ]
    `);
  });

  test("should not add the marker column when the marker is disabled", () => {
    const columns = [{ id: "x" }];

    expect(columnAddMarker({ columns, marker: {}, markerEnabled: false })).toMatchInlineSnapshot(`
      [
        {
          "id": "x",
        },
      ]
    `);
  });

  test("should include additional marker column properties, excluding pin", () => {
    const columns = [{ id: "x" }];

    expect(
      columnAddMarker({ columns, marker: { width: 200, name: "Marker", pin: "end" }, markerEnabled: true }),
    ).toMatchInlineSnapshot(`
        [
          {
            "id": "lytenyte-marker-column",
            "name": "Marker",
            "pin": "start",
            "width": 200,
            "widthMin": 24,
          },
          {
            "id": "x",
          },
        ]
      `);
  });
});
