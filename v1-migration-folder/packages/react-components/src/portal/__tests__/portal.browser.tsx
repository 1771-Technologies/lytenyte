import { describe, expect, test } from "vitest";
import { render } from "vitest-browser-react";
import { Portal } from "../portal.js";
import { Dialog } from "../../dialog/index.js";

describe("Portal", () => {
  test("should render an element to the body", () => {
    render(
      <Portal>
        <div id="x">I will be on the body</div>
      </Portal>,
    );

    expect(document.getElementById("x")?.parentElement).toEqual(document.body);
  });

  test("should be able to re-target portal", () => {
    const deck = document.createElement("div");
    deck.id = "d";
    document.body.append(deck);

    render(
      <Portal target={deck}>
        <div id="x">I will be on the body</div>
      </Portal>,
    );

    expect(document.getElementById("x")?.parentElement).toEqual(deck);
  });

  test("should load portal in dialog automatically", () => {
    render(
      <Dialog.Root>
        <Dialog.Panel>
          <Portal>
            <div id="x">I will be on the body</div>
          </Portal>
        </Dialog.Panel>
      </Dialog.Root>,
    );
  });
});
