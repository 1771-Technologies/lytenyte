import { t } from "@1771technologies/grid-design";
import { clsx } from "@1771technologies/js-utils";
import type { ChangeEvent, HTMLProps } from "react";

export interface RadioProps {
  readonly onCheckChange?: (c: boolean, event: ChangeEvent) => void;
}

export function Radio({
  onCheckChange,
  checked,
  disabled,
  ...other
}: Omit<HTMLProps<HTMLInputElement>, "onChange"> & RadioProps) {
  return (
    <div
      className={clsx(
        css`
          display: flex;
          align-items: center;
          justify-content: center;
          block-size: 18px;
          inline-size: 18px;
          position: relative;
          border-radius: 9999px;
          box-sizing: border-box;
          background-color: ${t.colors.backgrounds_form_field};
          box-shadow:
            0px 1.5px 2px 0px ${t.colors.borders_field_and_button_shadow},
            0px 0px 0px 1px ${t.colors.borders_field_and_button};
          cursor: pointer;

          &:focus-within {
            outline: 1px solid ${t.colors.borders_focus};
          }
        `,
        !disabled &&
          css`
            &:hover {
              box-shadow:
                ${t.colors.gray_20} 0px 0px 2px 2px,
                ${t.colors.gray_20} 0px 0px 2px 2px;
            }
          `,
        disabled &&
          css`
            background-color: ${t.colors.borders_field_and_button};
          `,
        checked &&
          css`
            background-color: ${t.colors.primary_50};

            &::after {
              content: "";
              position: absolute;
              height: 8px;
              width: 8px;
              background-color: ${t.colors.gray_00};
              border-radius: 9999px;
            }
          `,
        disabled &&
          checked &&
          css`
            &::after {
              background-color: ${t.colors.gray_50};
            }
          `,
      )}
    >
      <input
        type="radio"
        className={css`
          all: unset;
          width: 100%;
          height: 100%;
          opacity: 0;
        `}
        checked={checked}
        onChange={(e) => onCheckChange?.(e.target.checked, e)}
        {...other}
      />
    </div>
  );
}
