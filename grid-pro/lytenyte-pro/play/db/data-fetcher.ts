import type { ServerDataSourceInitial } from "@1771technologies/grid-server-data-source";
import type { ReactNode } from "react";
import type { AsyncDataResponse } from "../../../grid-server-data-source/src/types";
import { sql } from "./server";

export const dataFetcher: ServerDataSourceInitial<any, ReactNode>["rowDataFetcher"] = async (p) => {
  await new Promise<void>((res) => {
    setTimeout(() => res(), 500);
  });

  const blockSize = p.blockSize;
  const blocks: AsyncDataResponse["blocks"] = [];
  const state = p.api.getState();

  const groupModel = state.rowGroupModel.peek();
  const isGrouping = groupModel.length > 0;

  let rootCount: number | undefined = undefined;
  if (isGrouping) {
    rootCount = sql<{ cnt: number }[]>(
      `SELECT count(*) AS cnt FROM banks GROUP BY ${groupModel[0]}`,
    ).length;
  } else {
    rootCount = sql<{ cnt: number }[]>(`SELECT count(*) AS cnt FROM banks`)[0].cnt;
  }

  for (let i = 0; i < p.requestBlocks.length; i++) {
    const b = p.requestBlocks[i];

    const groupKey = groupModel[b.path.length];

    // We have a row grouping so we need to group by item, offset and get count.
    if (groupKey) {
      const data = sql<{ childCnt: number; pathKey: string }[]>(
        `SELECT *, ${groupKey} AS pathKey, count(*) AS childCnt FROM banks GROUP BY ${groupKey} LIMIT ${blockSize} OFFSET ${blockSize * b.blockKey}`,
      );
      const cnt = sql<{ cnt: number }[]>(
        `SELECT count(*) AS cnt FROM banks GROUP BY ${groupKey}`,
      ).length;

      blocks.push({
        blockKey: b.blockKey,
        frame: {
          childCounts: data.map((d) => d.childCnt),
          data,
          ids: data.map((_, i) => `${i + b.blockKey * blockSize}__${b.path.join("/")}`),
          kinds: data.map(() => 2),
          pathKeys: data.map((c) => c.pathKey),
        },
        size: cnt,
      });
      continue;
    }

    const whereParts = b.path
      .map((c, i) => {
        return `${groupModel[i]} = '${c}'`;
      })
      .join(" AND ");

    const whereClause = whereParts ? `WHERE ${whereParts}` : "";

    const query = `SELECT * FROM banks ${whereClause} LIMIT ${blockSize} OFFSET ${b.blockKey * blockSize}`;
    const cntQuery = `SELECT count(*) AS cnt FROM banks ${whereClause}`;

    const data = sql(query) as any[];
    const count = sql<{ cnt: number }[]>(cntQuery)[0].cnt;

    blocks.push({
      blockKey: b.blockKey,
      frame: {
        childCounts: data.map(() => 0),
        data,
        ids: data.map((_, i) => `${b.path ? b.path.join("/") + "/" : ""}${i}`),
        kinds: data.map(() => 1),
        pathKeys: data.map(() => null),
      },
      path: b.path,
      size: count,
    });
  }

  return {
    blocks,
    reqTime: p.reqTime,
    rootCount,
  } satisfies AsyncDataResponse;
};
