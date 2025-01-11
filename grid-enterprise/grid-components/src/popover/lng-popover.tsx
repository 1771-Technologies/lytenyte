import { clsx } from "@1771technologies/js-utils";
import { t } from "@1771technologies/grid-design";
import { Popover } from "@1771technologies/react-popover";

export const LngPopover: typeof Popover = (props) => {
  return (
    <Popover
      {...props}
      className={clsx(
        css`
          background-color: ${t.colors.backgrounds_context_menu};
          border: 1px solid ${t.colors.borders_context_menu};
          border-radius: ${t.spacing.box_radius_large};
          padding: ${t.spacing.space_05};

          box-shadow: ${t.shadows[400]};

          &:focus {
            outline: none;
          }

          &::backdrop {
            background-color: transparent;
          }
        `,
        props.className,
      )}
    />
  );
};
