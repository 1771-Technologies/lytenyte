import type { ApiEnterpriseReact } from "@1771technologies/grid-types";
import { RefreshIcon } from "../icons/refresh-icon";
import { t } from "@1771technologies/grid-design";

export function SwapPivots<D>({ api }: { api: ApiEnterpriseReact<D> }) {
  return (
    <div
      className={css`
        position: relative;
      `}
    >
      <button
        className={css`
          position: absolute;
          display: flex;
          align-items: center;
          gap: var(--lng1771-space-05);
          top: -8px;
          font-size: var(--lng1771-body-xs);
          background-color: var(--lng1771-gray-00);
          border: 1px solid var(--lng1771-borders-strong);
          color: var(--lng1771-primary-50);
          left: 45px;
          border-radius: var(--lng1771-box-radius-medium);
          cursor: pointer;
          z-index: 2;

          &:focus-visible {
            outline: none;
            border: 1px solid ${t.colors.borders_focus};
          }

          @container (max-width: 450px) {
            left: 22px;
            width: 14px;
            height: 14px;
            padding: 0;

            & span {
              display: none;
            }
          }
        `}
        onClick={() => {
          const sx = api.getState();
          const pivotModel = sx.columnPivotModel.peek();
          const rowModel = sx.rowGroupModel.peek();

          sx.columnPivotModel.set(rowModel);
          sx.rowGroupModel.set(pivotModel);
        }}
      >
        <RefreshIcon width={12} height={12} />
        <span>Swap</span>
      </button>
    </div>
  );
}
