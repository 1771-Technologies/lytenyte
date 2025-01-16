import { clsx } from "@1771technologies/js-utils";
import type { JSX, ReactNode, RefObject } from "react";
import { t } from "@1771technologies/grid-design";

export interface InputProps {
  readonly error?: boolean;
  readonly small?: boolean;
  readonly ghost?: boolean;
  readonly icon?: (p: JSX.IntrinsicElements["svg"]) => ReactNode;
  readonly inputRef?: RefObject<HTMLInputElement>;
}

export function Input({
  className,
  error,
  small,
  ghost,
  disabled,
  icon: Icon,
  inputRef,
  ...props
}: JSX.IntrinsicElements["input"] & InputProps) {
  return (
    <div
      className={clsx(
        css`
          height: 32px;
          color: ${t.colors.text_medium};
          display: flex;
          align-items: center;
          background-color: ${t.colors.backgrounds_form_field};
          border: 1px solid transparent;
          box-shadow:
            0px 1.5px 2px 0px ${t.colors.borders_field_and_button_shadow},
            0px 0px 0px 1px ${t.colors.borders_field_and_button};
          box-sizing: border-box;
          border-radius: ${t.spacing.field_padding_small};
          transition:
            box-shadow ${t.transitions.fn} ${t.transitions.normal},
            border-color ${t.transitions.fn} ${t.transitions.normal};

          & svg {
            padding-inline-start: ${t.spacing.space_10};
          }
          &:hover {
            box-shadow:
              0px 1.5px 2px 0px ${t.colors.borders_field_and_button_shadow},
              0px 0px 0px 1px ${t.colors.primary_30};
          }

          &:focus-within {
            border: 1px solid ${t.colors.borders_focus};
            box-shadow: 0px 0px 0px 2px ${t.colors.primary_30};
          }
        `,
        error &&
          css`
            border: 1.5px solid ${t.colors.system_red_50};
            box-shadow: 0px 0px 0px 2px ${t.colors.system_red_30};

            & svg {
              color: ${t.colors.system_red_50};
            }
          `,
        small &&
          css`
            height: 28px;
          `,
        disabled &&
          css`
            color: ${t.colors.text_x_light};
            box-shadow: unset;
            border: 1px solid ${t.colors.gray_30};
            background-color: ${t.colors.gray_10};

            &::placeholder {
              color: ${t.colors.text_x_light};
            }
            & svg {
              color: ${t.colors.gray_50};
            }
          `,
        ghost &&
          css`
            &:not(:focus-within) {
              box-shadow: none;
              border: 1px solid transparent;
            }
          `,
        className,
      )}
    >
      {Icon && <Icon width={small ? 16 : 20} height={small ? 16 : 20} />}
      <input
        ref={inputRef}
        {...props}
        disabled={disabled}
        className={clsx(
          "lng1771-text-small-300",
          css`
            border: none;
            background-color: transparent;
            height: 100%;
            width: 100%;
            margin-top: -1px;
            padding-block: 0px;
            box-sizing: border-box;
            padding-inline: ${t.spacing.field_padding_medium};
            &:focus {
              outline: none;
            }
            &::placeholder {
              position: relative;
              top: 1px;
            }
          `,
        )}
      />
    </div>
  );
}
