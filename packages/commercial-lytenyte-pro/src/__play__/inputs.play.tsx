import "../../css/light-dark.css";
import "../../css/components/input.css";

export default function Inputs() {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        gap: 20,
        padding: 20,
      }}
    >
      <input data-ln-input />
      <button data-ln-input style={{ width: 152 }}>
        Greater Than
      </button>
    </div>
  );
}
