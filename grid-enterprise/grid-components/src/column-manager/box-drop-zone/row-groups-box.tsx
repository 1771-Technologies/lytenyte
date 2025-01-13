import { cc } from "../../component-configuration";
import { BoxDropZone } from "./box-drop-zone";

export function RowGroupsBox() {
  const config = cc.columnManager.use().columnBoxes!;

  const Empty = config.iconEmpty!;
  const Icon = config.iconRowGroups!;

  return (
    <BoxDropZone
      collapsed={false}
      onCollapseChange={() => {}}
      emptyIcon={<Empty />}
      icon={<Icon />}
      emptyLabel={config.labelEmptyRowGroups!}
      label={config.labelRowGroups!}
    />
  );
}
