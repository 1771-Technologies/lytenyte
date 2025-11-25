import "../themes/ln-cotton-candy.css";
import "../themes/ln-shadcn-vars-fallback.css";
import "../themes/ln-dark.css";
import "../themes/ln-light.css";
import "../themes/ln-term.css";
import "../themes/ln-shadcn.css";
import "../themes/ln-teal.css";
import "./theming.css";
import { useState } from "react";

const grays = ["00", "01", "02", "05", "10", "20", "30", "40", "50", "60", "70", "80", "90", "100"];
const primary = ["05", "10", "30", "50", "70", "90"];
const system = ["10", "30", "50", "70", "90"];
const borders = [
  "",
  "row",
  "strong",
  "icon",
  "ui-panel",
  "button-light",
  "field-and-button",
  "field-and-button-shadow",
  "floating-panel",
  "context-menu",
];
const backgrounds = [
  "",
  "button-light",
  "page",
  "light",
  "strong",
  "row-hover",
  "row-alternate",
  "ui-panel",
  "form-field",
  "floating-panel",
  "context-menu",
];
const text = ["", "dark", "light", "xlight", "hyperlink", "primary-button"];
const pills = [
  "row-pivot-fill",
  "row-pivot-stroke",
  "column-pivot-fill",
  "column-pivot-stroke",
  "column-group-fill",
  "column-group-stroke",
];

export default function Theming() {
  const [theme, setTheme] = useState("ln-dark");
  return (
    <div
      className={theme}
      style={{
        height: "100vh",
        width: "100vw",
        padding: 24,
        boxSizing: "border-box",
        background: "var(--ln-bg-page)",
        color: "var(--ln-text-dark)",
        display: "flex",
        flexDirection: "column",
        gap: 16,
      }}
    >
      <div>
        <select value={theme} onChange={(e) => setTheme(e.target.value)}>
          <option value="ln-dark">Dark</option>
          <option value="ln-light">Light</option>
          <option value="ln-term">Term</option>
          <option value="ln-cotton-candy">Candy Cotton</option>
          <option value="ln-teal">Teal</option>
          <option value="ln-shadcn light">Shadcn Light</option>
          <option value="ln-shadcn xdark">Shadcn Dark</option>
        </select>
      </div>
      <div>
        <div style={{ paddingBlock: "8px" }}>Grays</div>
        <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
          {grays.map((x) => {
            return <ColorBox key={x} color={`var(--ln-gray-${x})`} label={`Gray ${x}`} />;
          })}
        </div>
        <div style={{ paddingBlockStart: "32px", paddingBlockEnd: "8px" }}>Primary</div>
        <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
          {primary.map((x) => {
            return <ColorBox key={x} color={`var(--ln-primary-${x})`} label={`Primary ${x}`} />;
          })}
        </div>

        <div style={{ paddingBlockStart: "32px", paddingBlockEnd: "8px" }}>System Red</div>
        <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
          {system.map((x) => {
            return <ColorBox key={x} color={`var(--ln-system-red-${x})`} label={`Red ${x}`} />;
          })}
        </div>
        <div style={{ paddingBlockStart: "32px", paddingBlockEnd: "8px" }}>System Yellow</div>
        <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
          {system.map((x) => {
            return (
              <ColorBox key={x} color={`var(--ln-system-yellow-${x})`} label={`Yellow ${x}`} />
            );
          })}
        </div>
        <div style={{ paddingBlockStart: "32px", paddingBlockEnd: "8px" }}>System Green</div>
        <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
          {system.map((x) => {
            return <ColorBox key={x} color={`var(--ln-system-green-${x})`} label={`Green ${x}`} />;
          })}
        </div>
        <div style={{ paddingBlockStart: "32px", paddingBlockEnd: "8px" }}>System Info</div>
        <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
          {system.map((x) => {
            return <ColorBox key={x} color={`var(--ln-system-info-${x})`} label={`Info ${x}`} />;
          })}
        </div>
        <div style={{ paddingBlockStart: "32px", paddingBlockEnd: "8px" }}>Borders</div>
        <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
          {borders.map((x) => {
            return (
              <ColorBox
                key={x}
                color={x ? `var(--ln-border-${x})` : "var(-ln-border"}
                label={`Border ${x}`}
              />
            );
          })}
        </div>
        <div style={{ paddingBlockStart: "32px", paddingBlockEnd: "8px" }}>Backgrounds</div>
        <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
          {backgrounds.map((x) => {
            return (
              <ColorBox
                key={x}
                color={x ? `var(--ln-bg-${x})` : "var(--ln-bg)"}
                label={`BG ${x}`}
              />
            );
          })}
        </div>
        <div style={{ paddingBlockStart: "32px", paddingBlockEnd: "8px" }}>Text</div>
        <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
          {text.map((x) => {
            return (
              <ColorBox
                key={x}
                color={x ? `var(--ln-text-${x})` : "var(--ln-text)"}
                label={`Text ${x}`}
              />
            );
          })}
        </div>
        <div style={{ paddingBlockStart: "32px", paddingBlockEnd: "8px" }}>Pill</div>
        <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
          {pills.map((x) => {
            return <ColorBox key={x} color={`var(--ln-system-${x})`} label={`Pill ${x}`} />;
          })}
        </div>
      </div>
    </div>
  );
}

function ColorBox({ color, label }: { color: string; label: string }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
      <div
        style={{
          width: "200px",
          height: "50px",
          borderRadius: "8px",
          background: color,
          border: "1px solid var(--ln-border)",
        }}
      ></div>
      {label}
    </div>
  );
}
