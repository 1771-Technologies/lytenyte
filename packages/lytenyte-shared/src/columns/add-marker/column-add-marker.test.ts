import { describe, expect, test } from "vitest";
import { columnAddMarker } from "./column-add-marker.js";

describe("columnAddMarker", () => {
  test("Should add the marker column when the marker is enabled", () => {
    const columns = [{ id: "x" }];

    expect(columnAddMarker({ columns, marker: { on: true } })).toMatchInlineSnapshot(`
      [
        {
          "id": "lytenyte-marker-column",
          "name": "",
          "on": true,
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

  test("Should not add the marker column when the marker is disabled", () => {
    const columns = [{ id: "x" }];

    expect(columnAddMarker({ columns, marker: { on: false } })).toMatchInlineSnapshot(`
      [
        {
          "id": "x",
        },
      ]
    `);
  });

  test("should include additional marker column properties, excluding pin", () => {
    const columns = [{ id: "x" }];

    expect(columnAddMarker({ columns, marker: { on: true, width: 200, name: "Marker", pin: "end" } }))
      .toMatchInlineSnapshot(`
        [
          {
            "id": "lytenyte-marker-column",
            "name": "Marker",
            "on": true,
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
