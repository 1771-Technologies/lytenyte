import { expect, test } from "vitest";
import { handleInnerItemFocus } from "../handle-inner-item-focus.js";
import { wait } from "../../../js-utils/sleep.js";

test("handleInnerItemFocus should handle the standard cycle", async () => {
  const el = document.createElement("div");
  el.tabIndex = 0;
  const tab1 = document.createElement("div");
  tab1.innerText = "Alpha";
  tab1.tabIndex = 0;
  const tab2 = document.createElement("div");
  tab2.tabIndex = 0;
  tab2.innerText = "Beta";
  const tab3 = document.createElement("div");
  tab3.tabIndex = 0;
  tab3.innerText = "Sigma";
  el.appendChild(tab1);
  el.appendChild(tab2);
  el.appendChild(tab3);

  document.body.appendChild(el);

  el.focus();
  await expect.element(el).toHaveFocus();

  handleInnerItemFocus(el, document.activeElement as HTMLElement, false, false);
  await expect.element(tab1).toHaveFocus();

  handleInnerItemFocus(el, tab1, false, false);
  await expect.element(tab2).toHaveFocus();

  handleInnerItemFocus(el, tab2, false, false);
  await expect.element(tab3).toHaveFocus();

  handleInnerItemFocus(el, tab3, false, false);
  await expect.element(tab3).toHaveFocus();

  handleInnerItemFocus(el, tab3, false, false);
  await expect.element(tab3).toHaveFocus();

  handleInnerItemFocus(el, tab3, true, false);
  await expect.element(tab2).toHaveFocus();
  handleInnerItemFocus(el, tab2, true, false);
  await expect.element(tab1).toHaveFocus();
  handleInnerItemFocus(el, tab1, true, false);
  await expect.element(el).toHaveFocus();
  handleInnerItemFocus(el, el, true, true);
  await expect.element(tab3).toHaveFocus();
  handleInnerItemFocus(el, tab3, false, true);
  await expect.element(tab1).toHaveFocus();

  tab2.tabIndex = -1;
  tab2.focus();
  await expect.element(tab2).toHaveFocus();
  handleInnerItemFocus(el, tab2, false, false);
  await expect.element(tab3).toHaveFocus();

  tab2.tabIndex = -1;
  tab2.focus();
  await expect.element(tab2).toHaveFocus();
  handleInnerItemFocus(el, tab2, true, false);
  await expect.element(tab1).toHaveFocus();

  handleInnerItemFocus(el, document.createElement("div"), false, false);
  await expect.element(tab1).toHaveFocus();

  el.focus();
  await expect.element(el).toHaveFocus();
  handleInnerItemFocus(el, el, true, false);
  await expect.element(el).toHaveFocus();
  el.innerHTML = "";
  handleInnerItemFocus(el, el, true, true);
  await expect.element(el).toHaveFocus();

  el.appendChild(tab1);
  el.appendChild(tab2);
  el.appendChild(tab3);
  el.tabIndex = -1;
  tab1.focus();
  handleInnerItemFocus(el, tab1, true, false);

  tab2.tabIndex = -1;
  tab3.tabIndex = -1;
  const tab4 = document.createElement("div");
  tab4.tabIndex = 0;
  tab4.innerText = "Break";
  el.appendChild(tab4);

  tab2.focus();
  await expect.element(tab2).toHaveFocus();
  handleInnerItemFocus(el, tab2, false, true);
  await expect.element(tab4).toHaveFocus();
  tab3.focus();
  await expect.element(tab3).toHaveFocus();
  handleInnerItemFocus(el, tab3, true, true);
  await expect.element(tab1).toHaveFocus();

  tab1.tabIndex = -1;
  tab4.tabIndex = -1;
  tab3.focus();
  el.tabIndex = 0;
  await expect.element(tab3).toHaveFocus();
  handleInnerItemFocus(el, tab3, true, true);
  await expect.element(el).toHaveFocus();

  tab3.focus();
  el.tabIndex = -1;
  await expect.element(tab3).toHaveFocus();
  handleInnerItemFocus(el, tab3, true, true);
  await wait();
  await expect.element(el).not.toHaveFocus();

  tab3.focus();
  el.tabIndex = 0;
  await expect.element(tab3).toHaveFocus();
  handleInnerItemFocus(el, tab3, false, true);
  await wait();
  await expect.element(el).not.toHaveFocus();
});
