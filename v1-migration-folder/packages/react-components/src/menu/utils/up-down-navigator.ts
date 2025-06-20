import { makeNavigate } from "../../utils/navigator.js";
import { isMenuItem } from "../utils/is-menu-item.js";
import { isSameDepth } from "../utils/is-same-depth.js";

export const upDownMover = makeNavigate({
  elementFilter: (el, cn) => {
    return isMenuItem(el) && isSameDepth(cn, el);
  },
  includeFocusables: true,
  nextKey: "ArrowDown",
  prevKey: "ArrowUp",
});
