import { t } from "@1771technologies/grid-design";
import { clsx } from "@1771technologies/js-utils";
import { useRef } from "react";

export interface ToggleProps {
  readonly on: boolean;
  readonly onChange: (b: boolean) => void;
  readonly disabled?: boolean;
}
export function Toggle({ on, onChange, disabled }: ToggleProps) {
  const ref = useRef<HTMLInputElement>(null);
  return (
    <div
      className={clsx(
        css`
          position: relative;
          width: 26px;
          height: 16px;
          background-color: ${t.colors.gray_40};
          border-radius: ${t.spacing.box_radius_large};
          cursor: pointer;

          &:focus {
            outline-offset: 0px;
            outline: 2px solid ${t.colors.borders_focus};
          }

          &:hover {
            box-shadow:
              ${t.colors.gray_20} 0px 0px 2px 2px,
              ${t.colors.gray_20} 0px 0px 2px 2px;
          }

          & input {
            opacity: 0;
            position: absolute;
            width: 0px;
            height: 0px;
          }
        `,
        on &&
          !disabled &&
          css`
            background-color: ${t.colors.primary_50};
          `,
        disabled &&
          css`
            cursor: not-allowed;
          `,
      )}
      onClick={() => {
        if (disabled) return;
        onChange(!on);
        ref.current?.focus();
      }}
    >
      <div
        className={clsx(
          on &&
            css`
              width: 12px;
              height: 12px;
              background-color: ${t.colors.gray_00};
              position: absolute;
              top: 2px;
              right: 2px;
              border-radius: 9999px;
            `,
          !on &&
            css`
              width: 12px;
              height: 12px;
              background-color: ${t.colors.gray_00};
              position: absolute;
              top: 2px;
              left: 2px;
              border-radius: 9999px;
            `,

          disabled &&
            css`
              background-color: ${t.colors.gray_50};
            `,
        )}
      ></div>
      <input
        ref={ref}
        type="checkbox"
        checked={on}
        onChange={(e) => onChange(e.target.checked)}
        disabled={disabled}
      />
    </div>
  );
}
