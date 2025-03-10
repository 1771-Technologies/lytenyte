import{w as R,u as E}from"./index-BM0gtWul.js";var i={exports:{}},n={};/**
 * @license React
 * react-jsx-runtime.production.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var l;function _(){if(l)return n;l=1;var e=Symbol.for("react.transitional.element"),a=Symbol.for("react.fragment");function c(v,t,r){var o=null;if(r!==void 0&&(o=""+r),t.key!==void 0&&(o=""+t.key),"key"in t){r={};for(var u in t)u!=="key"&&(r[u]=t[u])}else r=t;return t=r.ref,{$$typeof:e,type:v,key:o,ref:t!==void 0?t:null,props:r}}return n.Fragment=a,n.jsx=c,n.jsxs=c,n}var p;function k(){return p||(p=1,i.exports=_()),i.exports}var T=k();const y={title:"Example/Button",component:e=>T.jsx("button",{...e}),parameters:{layout:"centered"}},s={args:{children:"Button For Testing"},play:async({canvasElement:e})=>{const a=R(e);await E.click(a.getByRole("button"))}};var m,x,d;s.parameters={...s.parameters,docs:{...(m=s.parameters)==null?void 0:m.docs,source:{originalSource:`{
  args: {
    children: "Button For Testing"
  },
  play: async ({
    canvasElement
  }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole("button"));
  }
}`,...(d=(x=s.parameters)==null?void 0:x.docs)==null?void 0:d.source}}};const h=["Primary"];export{s as Primary,h as __namedExportsOrder,y as default};
