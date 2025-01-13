import { cc } from "../../component-configuration";
import { BoxDropZone } from "./box-drop-zone";

export function MeasuresBox() {
  const config = cc.columnManager.use().columnBoxes!;

  const Empty = config.iconEmpty!;
  const Icon = config.iconMeasures!;

  return (
    <BoxDropZone
      collapsed={false}
      onCollapseChange={() => {}}
      emptyIcon={<Empty />}
      icon={<Icon />}
      emptyLabel={config.labelEmptyMeasures!}
      label={config.labelMeasures!}
    />
  );
}
