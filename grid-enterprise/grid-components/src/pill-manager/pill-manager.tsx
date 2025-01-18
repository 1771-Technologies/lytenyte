import type { ApiEnterpriseReact } from "@1771technologies/grid-types";
import { PillRow } from "./pill-row";
import { cc } from "../component-configuration";
import { ColumnsIcon } from "../icons/columns-icon";
import { MeasuresIcon } from "../column-manager/icons/measures-icon";
import { RowGroupIcon } from "../icons/row-group-icon";
import { SwapPivots } from "./swap-pivots";
import { ColumnPivotIcon } from "../icons/column-pivots-icon";
import { useColumnPills } from "./use-column-pills";
import { useRowGroupPills } from "./use-row-groups-pills";
import { useColumnPivotPills } from "./use-column-pivot-pills";
import { useMeasurePills } from "./use-measure-pills";

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
export function PillManager<D>({ api }: PillManagerProps<D>) {
  const config = cc.pillManager.use();

  const {
    pillItems: columnPills,
    onPillSelect: onColumnPillSelect,
    onDrop: onColumnDrop,
  } = useColumnPills(api);
  const {
    pillItems: rowGroupPills,
    onPillSelect: onRowGroupPillSelect,
    onDrop: onGroupDrop,
  } = useRowGroupPills(api);
  const { pillItems: columnPivotPills, onPillSelect: onColumnPivotPillSelect } =
    useColumnPivotPills(api);
  const { pillItems: measurePills, onPillSelect: onMeasurePillSelect } = useMeasurePills(api);

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

          --lng1771-opacity-val: 0;
          --lng1771-overflow-val: hidden;

          &:hover {
            --lng1771-opacity-val: 0.45;
            --lng1771-overflow-val: auto;
          }

          @container (max-width: 450px) {
            display: grid;
            grid-template-columns: 50px calc(100% - 50px - 30px) 30px;
          }
        `}
      >
        <PillRow
          label={config.axe!.labelColumns}
          icon={ColumnsIcon}
          pillItems={columnPills}
          onPillSelect={onColumnPillSelect}
          onPillDrop={onColumnDrop}
          draggable
        />
        <PillRow
          label={config.axe!.labelMeasures}
          icon={MeasuresIcon}
          pillItems={measurePills}
          onPillSelect={onMeasurePillSelect}
        />
        <PillRow
          label={config.axe!.labelRowGroups}
          icon={RowGroupIcon}
          pillItems={rowGroupPills}
          onPillSelect={onRowGroupPillSelect}
          onPillDrop={onGroupDrop}
          draggable
        />
        <SwapPivots api={api} />
        <PillRow
          label={config.axe!.labelColumnPivots}
          icon={ColumnPivotIcon}
          pillItems={columnPivotPills}
          onPillSelect={onColumnPivotPillSelect}
        />
      </div>
    </div>
  );
}
