import type { Root } from "../../../root/root";

export function HeaderGroupDefault({ groupPath }: Root.HeaderGroupParams<any>) {
  return <>{groupPath.at(-1)}</>;
}
