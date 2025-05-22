import htm from "htm";
import h from "hyperscript";
import { beforeEach, expect, test } from "vitest";
import { isDisabledFromFieldset } from "../is-disabled-from-fieldset";

export const html = htm.bind(h);
export const addToBody = (h: Element | Element[]) => {
  if (Array.isArray(h)) h.forEach((el) => document.body.append(el));
  else document.body.append(h);
};

beforeEach(() => {
  document.body.innerHTML = "";
});

test("isDisabledFromFieldset: should return the correct result when disabled", () => {
  addToBody(html`
    <form>
      <fieldset disabled>
        <legend>Choose your favorite monster</legend>

        <input type="radio" id="kraken" name="monster" value="K" />
        <label for="kraken">Kraken</label><br />

        <input type="radio" id="sasquatch" name="monster" value="S" />
        <label for="sasquatch">Sasquatch</label><br />

        <input type="radio" id="mothman" name="monster" value="M" />
        <label for="mothman">Mothman</label>
      </fieldset>
    </form>
  `);

  const el = document.getElementById("sasquatch")!;

  expect(isDisabledFromFieldset(el)).toEqual(true);
});

test("isDisabledFromFieldset: should return the correct result when not disabled", () => {
  addToBody(html`
    <form>
      <fieldset>
        <legend>Choose your favorite monster</legend>

        <input type="radio" id="kraken" name="monster" value="K" />
        <label for="kraken">Kraken</label><br />

        <input type="radio" id="sasquatch" name="monster" value="S" />
        <label for="sasquatch">Sasquatch</label><br />

        <input type="radio" id="mothman" name="monster" value="M" />
        <label for="mothman">Mothman</label>
      </fieldset>
    </form>
  `);

  const el = document.getElementById("sasquatch")!;

  expect(isDisabledFromFieldset(el)).toEqual(false);
});

test("isDisabledFromFieldset: should return the correct result when disabled with no legend", () => {
  addToBody(html`
    <form>
      <fieldset disabled>
        <input type="radio" id="kraken" name="monster" value="K" />
        <label for="kraken">Kraken</label><br />

        <input type="radio" id="sasquatch" name="monster" value="S" />
        <label for="sasquatch">Sasquatch</label><br />

        <input type="radio" id="mothman" name="monster" value="M" />
        <label for="mothman">Mothman</label>
      </fieldset>
    </form>
  `);

  const el = document.getElementById("sasquatch")!;

  expect(isDisabledFromFieldset(el)).toEqual(true);
});

test("isDisabledFromFieldset: should return the correct result when the fieldset is disabled and legend", () => {
  addToBody(html`
    <form>
      <fieldset>
        <legend>
          Choose your favorite monster

          <input type="radio" id="kraken" name="monster" value="K" />
          <label for="kraken">Kraken</label><br />
        </legend>

        <input type="radio" id="sasquatch" name="monster" value="S" />
        <label for="sasquatch">Sasquatch</label><br />

        <input type="radio" id="mothman" name="monster" value="M" />
        <label for="mothman">Mothman</label>
      </fieldset>
    </form>
  `);

  const el = document.getElementById("kraken")!;

  expect(isDisabledFromFieldset(el)).toEqual(false);
});

test("isDisabledFromFieldset: should return the correct result when the fieldset is disabled and legend", () => {
  addToBody(html`
    <form>
      <fieldset disabled>
        <input type="radio" id="sasquatch" name="monster" value="S" />
        <label for="sasquatch">Sasquatch</label><br />

        <fieldset>
          <legend>
            Choose your favorite monster

            <input type="radio" id="kraken" name="monster" value="K" />
            <label for="kraken">Kraken</label><br />
          </legend>

          <input type="radio" id="sasquatch" name="monster" value="S" />
          <label for="sasquatch">Sasquatch</label><br />

          <input type="radio" id="mothman" name="monster" value="M" />
          <label for="mothman">Mothman</label>
        </fieldset>
      </fieldset>
    </form>
  `);

  const el = document.getElementById("kraken")!;

  expect(isDisabledFromFieldset(el)).toEqual(true);
});
