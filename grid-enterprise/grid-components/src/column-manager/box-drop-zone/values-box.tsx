import { cc } from "../../component-configuration";
import { BoxDropZone } from "./box-drop-zone";

export function ValuesBox() {
  const config = cc.columnManager.use().columnBoxes!;

  const Empty = config.iconEmpty!;
  const Icon = config.iconValues!;

  return (
    <BoxDropZone
      collapsed={false}
      onCollapseChange={() => {}}
      emptyIcon={<Empty />}
      icon={<Icon />}
      emptyLabel={config.labelEmptyValues!}
      label={config.labelValues!}
    />
  );
}
