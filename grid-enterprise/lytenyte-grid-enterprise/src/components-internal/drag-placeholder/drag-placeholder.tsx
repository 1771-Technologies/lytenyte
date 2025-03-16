import { t } from "@1771technologies/grid-design";
import { clsx } from "@1771technologies/js-utils";

export const DragPlaceholder = ({ label }: { label: string }) => {
  return (
    <div
      className={clsx(
        "lng1771-text-medium",
        css`
          color: ${t.colors.text_x_light};
          min-width: 120px;
          height: 30px;
          display: flex;
          align-items: center;
          padding-inline: ${t.spacing.space_30};
          padding-block: ${t.spacing.space_05};
          box-shadow: ${t.shadows[300]};
          background-color: ${t.colors.gray_00};
          border: 1px solid ${t.colors.borders_strong};
          border-radius: ${t.spacing.box_radius_regular};
        `,
      )}
    >
      {label}
    </div>
  );
};
