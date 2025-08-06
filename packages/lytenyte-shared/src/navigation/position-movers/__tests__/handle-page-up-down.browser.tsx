import { describe, expect, test, vi } from "vitest";
import { render } from "vitest-browser-react";
import { RowReact } from "../../../renderer-react/row";
import { CellReact } from "../../../renderer-react/cell";
import { atom, createStore } from "@1771technologies/atom";
import { makeGridAtom } from "../../../grid-atom/make-grid-atom";
import type { PositionGridCell, PositionUnion } from "../../../+types";
import { handlePageUpDown } from "../handle-page-up-down";
import { userEvent } from "@vitest/browser/context";
import { RowsCenterReact } from "../../../renderer-react/rows-sections";

describe("handlePageUpDown", () => {
  test("should correctly focus positions", async () => {
    const s = render(
      <div data-testid="vp">
        <RowsCenterReact height={100} rowFirst={0} rowLast={3} data-testid="center">
          <RowReact
            gridId="x"
            rowFirstPinBottom={false}
            rowIndex={0}
            rowIsFocusRow={false}
            rowLastPinTop={false}
            yPositions={new Uint32Array([0, 100, 200, 300])}
            accepted={[]}
          >
            <CellReact
              cell={{
                colIndex: 0,
                colSpan: 1,
                rowIndex: 0,
                rowSpan: 1,
              }}
              data-testid="first"
              detailHeight={0}
              isEditing={false}
              rtl={false}
              viewportWidth={1000}
              xPosition={new Uint32Array([0, 100, 200, 300])}
              yPosition={new Uint32Array([0, 100, 200, 300])}
            >
              <button>A</button>
              <button>B</button>
            </CellReact>
          </RowReact>

          <RowReact
            gridId="x"
            accepted={[]}
            rowFirstPinBottom={false}
            rowIndex={1}
            rowIsFocusRow={false}
            rowLastPinTop={false}
            yPositions={new Uint32Array([0, 100, 200, 300])}
          >
            <CellReact
              cell={{
                colIndex: 0,
                colSpan: 1,
                rowIndex: 1,
                rowSpan: 1,
              }}
              data-testid="second"
              detailHeight={0}
              isEditing={false}
              rtl={false}
              viewportWidth={1000}
              xPosition={new Uint32Array([0, 100, 200, 300])}
              yPosition={new Uint32Array([0, 100, 200, 300])}
            >
              <button>A</button>
              <button>B</button>
            </CellReact>
          </RowReact>
        </RowsCenterReact>
      </div>,
    );

    const store = createStore();
    const focusActive = makeGridAtom(
      atom<PositionUnion | null>({
        colIndex: 0,
        rowIndex: 0,
        root: null,
        kind: "cell",
      } satisfies PositionGridCell),
      store,
    );
    const vp = s.getByTestId("vp").element() as HTMLElement;

    await userEvent.click(s.getByTestId("first"));
    await expect.element(s.getByTestId("first")).toHaveFocus();

    handlePageUpDown({
      pos: focusActive.get()!,
      centerCount: 2,
      focusActive,
      id: "x",
      isUp: false,
      layout: new Map(),
      scrollIntoView: vi.fn(),
      topCount: 0,
      vp: vp,
    });

    handlePageUpDown({
      pos: focusActive.get()!,
      centerCount: 2,
      focusActive,
      id: "x",
      isUp: true,
      layout: new Map(),
      scrollIntoView: vi.fn(),
      topCount: 0,
      vp: vp,
    });

    handlePageUpDown({
      pos: focusActive.get()!,
      centerCount: 0,
      focusActive,
      id: "x",
      isUp: true,
      layout: new Map(),
      scrollIntoView: vi.fn(),
      topCount: 0,
      vp: vp,
    });

    handlePageUpDown({
      pos: { kind: "header-cell", colIndex: 2 },
      centerCount: 2,
      focusActive,
      id: "x",
      isUp: true,
      layout: new Map(),
      scrollIntoView: vi.fn(),
      topCount: 0,
      vp: vp,
    });

    const center = s.getByTestId("center").element() as HTMLElement;
    center.removeAttribute("data-ln-rows-center");

    handlePageUpDown({
      pos: focusActive.get()!,
      centerCount: 2,
      focusActive,
      id: "x",
      isUp: true,
      layout: new Map(),
      scrollIntoView: vi.fn(),
      topCount: 0,
      vp: vp,
    });
  });
});
