import { fastShallowCompare } from "@1771technologies/lytenyte-js-utils";
import { objectEquals } from "@1771technologies/lytenyte-object-equals";
import { memo } from "react";

export function fastMemo<T>(component: T): T {
  return memo(component as any, fastShallowCompare) as unknown as T;
}

/* v8 ignore next 1 */
const equalsReact = (a: any, b: any) => objectEquals(a, b, { react: true });
export function fastDeepMemo<T>(component: T): T {
  return memo(component as any, equalsReact) as unknown as T;
}
