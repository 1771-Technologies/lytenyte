// @ts-expect-error this
import { all as x } from "ln:all";

interface All {
  readonly id: string;
  readonly data: {
    title: string;
    description?: string;
    step?: string;
  };
  readonly filePath: string;
  readonly collection: string;
}

export const allCollections = x as All[];

export const byId = Object.fromEntries(
  allCollections.map((x) => {
    return [`/${x.collection}/${x.id}`, x];
  }),
);
