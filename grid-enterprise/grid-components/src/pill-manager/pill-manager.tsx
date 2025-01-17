import type { ApiEnterpriseReact } from "@1771technologies/grid-types";
import { PillRow } from "./pill-row";
import { cc } from "../component-configuration";
import { ColumnsIcon } from "../icons/columns-icon";
import { MeasuresIcon } from "../column-manager/icons/measures-icon";
import { RowGroupIcon } from "../icons/row-group-icon";
import { SwapPivots } from "./swap-pivots";
import { ColumnPivotIcon } from "../icons/column-pivots-icon";
import { useColumnPills } from "./use-column-pills";

export interface PillManagerConfiguration {
  readonly axe?: {
    readonly labelColumns: string;
    readonly labelMeasures: string;
    readonly labelRowGroups: string;
    readonly labelColumnPivots: string;
  };
}

export interface PillManagerProps<D> {
  readonly api: ApiEnterpriseReact<D>;

  readonly showSwapButton?: boolean;
  readonly hideColumns?: boolean;
  readonly hideRowGroups?: boolean;
  readonly hideColumnPivots?: boolean;
  readonly hideMeasures?: boolean;
}
export function PillManager<D>({
  api,
  hideColumns,
  hideColumnPivots,
  hideMeasures,
  hideRowGroups,
  showSwapButton,
}: PillManagerProps<D>) {
  const sx = api.getState();
  const isPivotMode = sx.columnPivotModeIsOn.use();

  const config = cc.pillManager.use();

  const column = useColumnPills(api);

  return (
    <div
      className={css`
        container-type: inline-size;
      `}
    >
      <div
        className={css`
          display: grid;
          grid-template-columns: 160px calc(100% - 160px - 30px) 30px;

          @container (max-width: 450px) {
            display: grid;
            grid-template-columns: 50px calc(100% - 50px - 30px) 30px;
          }
        `}
      >
        {!isPivotMode && !hideColumns && (
          <PillRow label={config.axe!.labelColumns} icon={ColumnsIcon} pillItems={column} />
        )}
        {isPivotMode && !hideMeasures && (
          <PillRow label={config.axe!.labelMeasures} icon={MeasuresIcon} pillItems={[]} />
        )}
        {!hideRowGroups && (
          <PillRow label={config.axe!.labelRowGroups} icon={RowGroupIcon} pillItems={[]} />
        )}
        {isPivotMode && !hideRowGroups && !hideColumnPivots && showSwapButton && (
          <SwapPivots api={api} />
        )}
        {isPivotMode && !hideColumnPivots && (
          <PillRow label={config.axe!.labelColumnPivots} icon={ColumnPivotIcon} pillItems={[]} />
        )}
      </div>
    </div>
  );
}
