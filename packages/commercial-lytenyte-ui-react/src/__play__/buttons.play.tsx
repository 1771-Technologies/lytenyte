import "@1771technologies/lytenyte-design/font.css";
import "@1771technologies/lytenyte-design/design.css";

import "@1771technologies/lytenyte-design/light.css";
import "@1771technologies/lytenyte-design/dark.css";
import "@1771technologies/lytenyte-design/term.css";
import "@1771technologies/lytenyte-design/teal.css";
import "@1771technologies/lytenyte-design/cotton-candy.css";

import "@1771technologies/lytenyte-design/shadcn-vars.css";
import "@1771technologies/lytenyte-design/shadcn.css";

import "../design/button.css";

export default function Buttons() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "8px" }} className="ln-light">
      <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
        <button data-ln-size="sm" data-ln-button="primary">
          Button
        </button>
        <button data-ln-size="md" data-ln-button="primary">
          Button
        </button>
        <button data-ln-size="lg" data-ln-button="primary">
          Button
        </button>
        <button data-ln-size="mx" data-ln-button="primary">
          Button
        </button>
      </div>
    </div>
  );
}
