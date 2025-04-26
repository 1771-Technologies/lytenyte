import type { ServerDataSourceInitial } from "@1771technologies/grid-server-data-source";
import type { ReactNode } from "react";
import type { AsyncDataResponse } from "../../../grid-server-data-source/src/types";
import { sql } from "./server";

const BLOCK_SIZE = 100;

export const dataFetcher: ServerDataSourceInitial<any, ReactNode>["rowDataFetcher"] = async (p) => {
  await new Promise<void>((res) => {
    setTimeout(() => res(), 500);
  });

  const blocks: AsyncDataResponse["blocks"] = [];

  for (let i = 0; i < p.requestBlocks.length; i++) {
    const b = p.requestBlocks[i];

    const data = sql(
      `SELECT * FROM banks LIMIT ${BLOCK_SIZE} OFFSET ${b.blockKey * BLOCK_SIZE}`,
    ) as any[];
    const count = sql<{ cnt: number }[]>(`SELECT count(*) AS cnt FROM banks`)[0].cnt;

    blocks.push({
      blockKey: b.blockKey,
      frame: {
        childCounts: data.map(() => 0),
        data,
        ids: data.map((_, i) => `${i + b.blockKey * BLOCK_SIZE}`),
        kinds: data.map(() => 1),
        pathKeys: data.map(() => null),
      },
      size: count,
    });
  }

  return {
    blocks,
    reqTime: p.reqTime,
    rootCount: 2,
  } satisfies AsyncDataResponse;
};
