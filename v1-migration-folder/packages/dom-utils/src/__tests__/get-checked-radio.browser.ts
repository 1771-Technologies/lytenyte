import { describe, expect, test } from "vitest";
import { getCheckedRadio } from "../get-checked-radio.js";

import htm from "htm";
import h from "hyperscript";

export const html = htm.bind(h);
export const addToBody = (h: Element | Element[]) => {
  if (Array.isArray(h)) h.forEach((el) => document.body.append(el));
  else document.body.append(h);
};

describe("getCheckedRadio", () => {
  test("checked radio", async () => {
    const form = html`
      <form>
        <input type="radio" id="html" name="fav_language" value="HTML" />
        <label for="html">HTML</label><br />
        <input type="radio" id="css" name="fav_language" value="CSS" />
        <label for="css">CSS</label><br />
        <input type="radio" id="javascript" name="fav_language" value="JavaScript" checked />
        <label for="javascript">JavaScript</label>
      </form>
    `;

    const el = getCheckedRadio(
      Array.from((form as any).childNodes) as HTMLElement[],
      form as HTMLFormElement,
    )!;
    await expect.element(el).toHaveProperty("id", "javascript");
  });

  test("should return undefined when there are no checked radios", () => {
    const form = html`
      <form>
        <input type="radio" id="html" name="fav_language" value="HTML" />
        <label for="html">HTML</label><br />
        <input type="radio" id="css" name="fav_language" value="CSS" />
        <label for="css">CSS</label><br />
        <input type="radio" id="javascript" name="fav_language" value="JavaScript" />
        <label for="javascript">JavaScript</label>
      </form>
    `;

    const el = getCheckedRadio(
      Array.from((form as any).childNodes) as HTMLElement[],
      form as HTMLFormElement,
    )!;
    expect(el).toEqual(undefined);
  });

  test("should return undefined when the check input does not belong to the correct form", () => {
    const form = html`
      <form>
        <input type="radio" id="html" name="fav_language" value="HTML" />
        <label for="html">HTML</label><br />
        <input type="radio" id="css" name="fav_language" value="CSS" />
        <label for="css">CSS</label><br />
        <input type="radio" id="javascript" name="fav_language" value="JavaScript" checked />
        <label for="javascript">JavaScript</label>
      </form>
      <form></form>
    `;

    const el = getCheckedRadio(
      Array.from((form as any)[0].childNodes) as HTMLElement[],
      (form as any)[1] as HTMLFormElement,
    )!;
    expect(el).toEqual(undefined);
  });
});
