import { t } from "@1771technologies/grid-design";
import { Radio } from "../../../components-internal/radio/radio";

interface LogicalSwitchProps {
  value: "and" | "or";
  onChange: (c: "and" | "or") => void;
}

export function LogicalSwitch({ value, onChange }: LogicalSwitchProps) {
  return (
    <div
      className={css`
        box-sizing: border-box;
        display: grid;
        grid-template-columns: 1fr 1fr;
        grid-column: span 1;
        gap: ${t.spacing.space_60};
        color: ${t.colors.text_medium};
        font-family: ${t.typography.typeface_body};
        font-size: ${t.typography.body_m};

        @container (min-width: 380px) {
          display: grid;
          grid-template-columns: subgrid;
          grid-column: span 2;
        }
      `}
    >
      <div
        className={css`
          display: flex;
          align-items: center;
          justify-content: flex-end;
          gap: ${t.spacing.space_10};
        `}
      >
        <Radio checked={value === "and"} onCheckChange={() => onChange("and")} />
        And
      </div>
      <div
        className={css`
          display: flex;
          align-items: center;
          gap: ${t.spacing.space_10};
        `}
      >
        <Radio checked={value === "or"} onCheckChange={() => onChange("or")} />
        Or
      </div>
    </div>
  );
}
