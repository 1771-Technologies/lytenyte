import { clsx } from "@1771technologies/js-utils";
import type { ChangeEvent, HTMLProps } from "react";

export interface CheckboxProps {
  isDeterminate?: boolean;
  isDisabled?: boolean;
  isLoading?: boolean;
  isChecked: boolean;
  onCheckChange?: (c: boolean, event: ChangeEvent) => void;
}

export function Checkbox({
  isDisabled,
  isChecked,
  isDeterminate,
  onCheckChange,
  isLoading,
  ...props
}: CheckboxProps & Omit<HTMLProps<HTMLInputElement>, "className">) {
  return (
    <div
      className={clsx(
        css`
          --lng1771-checkbox-size: 16px;
          position: relative;
          width: fit-content;
          height: fit-content;
          padding: var(--lng1771-space-02);
          border-radius: var(--lng1771-box-radius-regular);
          transition: background-color var(--lng1771-transition-normal) var(--lng1771-transition-fn);
        `,
        !isDisabled &&
          css`
            &:hover {
              background-color: var(--lng1771-gray-30);
            }
          `,
      )}
    >
      <input
        {...props}
        className={css`
          position: absolute;
          inset-inline-start: var(--lng1771-space-02);
          top: var(--lng1771-space-02);
          cursor: pointer;
          margin: 0;
          display: inline-block;
          opacity: 0;
          width: var(--lng1771-checkbox-size);
          height: var(--lng1771-checkbox-size);
        `}
        checked={isChecked}
        onPointerDownCapture={(e) => {
          e.stopPropagation();
          e.preventDefault();
        }}
        onChange={(e) => {
          onCheckChange?.(e.target.checked, e);
        }}
        type="checkbox"
        disabled={isDisabled}
      />
      <div
        className={clsx(
          css`
            display: flex;
            align-items: center;
            justify-content: center;
            box-sizing: border-box;
            border: 2px solid var(--lng1771-gray-40);
            border-radius: 4px;
            background-color: var(--lng1771-gray-00);
            width: var(--lng1771-checkbox-size);
            height: var(--lng1771-checkbox-size);
            pointer-events: none;

            & > svg {
              width: calc(var(--lng1771-checkbox-size) - 6px);
            }
          `,
          isDisabled &&
            css`
              background-color: var(--lng1771-gray-30);
              border-color: var(--lng1771-gray-30);
              color: var(--lng1771-gray-70);
            `,

          !isDisabled &&
            isChecked &&
            css`
              background-color: var(--lng1771-primary-50);
              border-color: var(--lng1771-primary-50);
              color: var(--lng1771-gray-00);
            `,

          isLoading &&
            css`
              @keyframes lng1771-checkbox-spinner {
                to {
                  transform: rotate(360deg);
                }
              }

              &::before {
                --lng1771-loading-size: calc(var(--lng1771-checkbox-size) - 4px);
                content: "";
                box-sizing: border-box;
                position: absolute;
                top: 50%;
                left: 50%;
                width: var(--lng1771-loading-size);
                height: var(--lng1771-loading-size);
                margin-top: calc(var(--lng1771-loading-size) / 2 * -1);
                margin-left: calc(var(--lng1771-loading-size) / 2 * -1);
                border-radius: 50%;
                border-top: 2px solid currentColor;
                border-right: 2px solid transparent;
                animation: lng1771-checkbox-spinner 0.6s linear infinite;
              }
            `,
        )}
      >
        {isChecked && !isDeterminate && <CheckMark />}
        {isChecked && isDeterminate && <CheckIndeterminate />}
        {!isChecked && isDisabled && <CheckboxDisabled />}
      </div>
    </div>
  );
}

function CheckMark() {
  return (
    <svg width="12" height="9" viewBox="0 0 11 9" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M1.38721 4.34783C2.92567 5.26087 4.15644 7.08696 4.46413 8C6.00259 4.34783 8.15644 1.91304 9.38721 1"
        stroke="currentcolor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function CheckIndeterminate() {
  return (
    <svg width="12" height="2" viewBox="0 0 11 2" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M1.38721 1H9.38721"
        stroke="currentcolor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function CheckboxDisabled() {
  return (
    <svg width="15" height="14" viewBox="0 0 15 14" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M0.720459 6.99967C0.720459 10.6812 3.70564 13.6663 7.38713 13.6663C11.0686 13.6663 14.0538 10.6812 14.0538 6.99967C14.0538 3.31745 11.0686 0.333008 7.38713 0.333008C3.70564 0.333008 0.720459 3.31745 0.720459 6.99967ZM4.29527 2.84412C5.15972 2.20042 6.22713 1.81449 7.38713 1.81449C10.2508 1.81449 12.5723 4.13597 12.5723 6.99967C12.5723 8.16042 12.1871 9.22782 11.5427 10.0915L4.29527 2.84412ZM2.20194 6.99967C2.20194 5.83079 2.59379 4.75597 3.24564 3.8893L10.4975 11.1412C9.63009 11.7937 8.55527 12.1849 7.38713 12.1849C4.52342 12.1849 2.20194 9.86338 2.20194 6.99967Z"
        fill="currentcolor"
      />
    </svg>
  );
}
