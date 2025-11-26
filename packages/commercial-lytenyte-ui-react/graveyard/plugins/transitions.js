import plugin from "tailwindcss/plugin";

export default plugin(function ({ addVariant }) {
  addVariant("ln-opening", '&[data-ln-transition="opening"]');
  addVariant("ln-closing", '&[data-ln-transition="closing"]');
  addVariant("ln-idle", '&[data-ln-transition="idle"]');
  addVariant("ln-active", '&[data-ln-active="true"]');
  addVariant("ln-open", '&[data-ln-open="true"]');

  addVariant("ln-placement-left", '&[data-ln-placement="left"]');
  addVariant("ln-placement-right", '&[data-ln-placement="right"]');
  addVariant("ln-placement-top", '&[data-ln-placement="top"]');
  addVariant("ln-placement-bottom", '&[data-ln-placement="bottom"]');

  addVariant("ln-group-opening", ':merge(.group)[data-ln-transition="opening"] &');
  addVariant("ln-group-closing", ':merge(.group)[data-ln-transition="closing"] &');
  addVariant("ln-group-idle", ':merge(.group)[data-ln-transition="idle"] &');
  addVariant("ln-group-active", ':merge(.group)[data-ln-active="true"] &');

  addVariant("ln-peer-opening", '.peer[data-ln-transition="opening"] ~ &');
  addVariant("ln-peer-closing", '.peer[data-ln-transition="closing"] ~ &');
  addVariant("ln-peer-idle", '.peer[data-ln-transition="idle"] ~ &');
  addVariant("ln-peer-active", '.peer[data-ln-active="true"] ~ &');
});
