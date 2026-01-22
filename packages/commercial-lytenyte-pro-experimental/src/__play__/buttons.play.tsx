import "../../css/light-dark.css";
import "@1771technologies/lytenyte-design/shadcn-vars.css";

import "../../css/components.css";

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
      <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
        <button data-ln-size="sm" data-ln-button="primary" disabled>
          Button
        </button>
        <button data-ln-size="md" data-ln-button="primary" disabled>
          Button
        </button>
        <button data-ln-size="lg" data-ln-button="primary" disabled>
          Button
        </button>
        <button data-ln-size="mx" data-ln-button="primary" disabled>
          Button
        </button>
      </div>
      <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
        <button data-ln-size="sm" data-ln-button="secondary">
          Button
        </button>
        <button data-ln-size="md" data-ln-button="secondary">
          Button
        </button>
        <button data-ln-size="lg" data-ln-button="secondary">
          Button
        </button>
        <button data-ln-size="mx" data-ln-button="secondary">
          Button
        </button>
      </div>
      <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
        <button data-ln-size="sm" data-ln-button="tertiary">
          Button
        </button>
        <button data-ln-size="md" data-ln-button="tertiary">
          Button
        </button>
        <button data-ln-size="lg" data-ln-button="tertiary">
          Button
        </button>
        <button data-ln-size="mx" data-ln-button="tertiary">
          Button
        </button>
      </div>
    </div>
  );
}
