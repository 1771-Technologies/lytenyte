export const CANDIDATE_SELECTORS = [
  "input:not([inert])",
  "select:not([inert])",
  "textarea:not([inert])",
  "a[href]:not([inert])",
  "button:not([inert])",
  "[tabindex]:not(slot):not([inert])",
  "audio[controls]:not([inert])",
  "video[controls]:not([inert])",
  '[contenteditable]:not([contenteditable="false"]):not([inert])',
  "details>summary:first-of-type:not([inert])",
  "details:not([inert])",
];
export const CANDIDATE_SELECTOR = /* #__PURE__ */ CANDIDATE_SELECTORS.join(",");
