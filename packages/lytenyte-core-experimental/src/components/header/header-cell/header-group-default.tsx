import type { HeaderGroupParams } from "../../../types/column.js";

export function HeaderGroupDefault({ groupPath }: HeaderGroupParams<any>) {
  return <>{groupPath.at(-1)}</>;
}
