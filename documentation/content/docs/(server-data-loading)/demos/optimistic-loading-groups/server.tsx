import type {
  AggModelFn,
  DataRequest,
  DataResponse,
  RowGroupModelItem,
} from "@1771technologies/lytenyte-pro/types";

import type { SalaryData } from "./data";
import { data } from "./data";

const sleep = () => new Promise((res) => setTimeout(res, 600));

export async function Server(
  reqs: DataRequest[],
  groupModel: RowGroupModelItem<SalaryData>[],
  aggModel: { [columnId: string]: { fn: AggModelFn<SalaryData> } },
) {
  // Simulate latency and server work.
  await sleep();

  return reqs.map((c) => {
    // Return flat items if there are no row groups
    if (!groupModel.length) {
      return {
        asOfTime: Date.now(),
        data: data.slice(c.start, c.end).map((x) => {
          return {
            kind: "leaf",
            id: x.id,
            data: x,
          };
        }),
        start: c.start,
        end: c.end,
        kind: "center",
        path: c.path,
        size: data.length,
      } satisfies DataResponse;
    }

    const groupLevel = c.path.length;
    const groupKeys = groupModel.slice(0, groupLevel + 1);

    const filteredForGrouping = data.filter((row) => {
      return c.path.every((v, i) => {
        const groupKey = groupModel[i];
        return `${row[groupKey as keyof SalaryData]}` === v;
      });
    });

    // This is the leaf level of the grouping
    if (groupLevel === groupModel.length) {
      return {
        kind: "center",
        asOfTime: Date.now(),
        start: c.start,
        end: c.end,
        path: c.path,
        data: filteredForGrouping.slice(c.start, c.end).map((x) => {
          return {
            kind: "leaf",
            id: x.id,
            data: x,
          };
        }),
        size: filteredForGrouping.length,
      } satisfies DataResponse;
    }

    const groupedData = Object.groupBy(filteredForGrouping, (r) => {
      const groupPath = groupKeys.map((g) => {
        if (typeof g !== "string")
          throw new Error("Non-string groups are not supported by this dummy implementation");

        return r[g as keyof SalaryData];
      });

      return groupPath.join(" / ");
    });

    const rows = Object.entries(groupedData);

    return {
      kind: "center",
      asOfTime: Date.now(),
      data: rows.slice(c.start, c.end).map((x) => {
        const childRows = x[1]!;

        const nextGroup = groupLevel + 1;
        let childCnt: number;
        if (nextGroup === groupModel.length) childCnt = childRows.length;
        else {
          childCnt = Object.keys(
            Object.groupBy(childRows, (x) => {
              const groupKey = groupModel[nextGroup];
              return x[groupKey as keyof SalaryData];
            }),
          ).length;
        }

        const aggData = Object.fromEntries(
          Object.entries(aggModel)
            .map(([column, m]) => {
              if (typeof m.fn !== "string")
                throw new Error(
                  "Non-string aggregations are not supported by this dummy implementation",
                );

              const id = column as keyof SalaryData;

              if (m.fn === "first") return [column, childRows[0][id]];
              if (m.fn === "last") return [column, childRows.at(-1)![id]];

              if (m.fn === "avg")
                return [
                  column,
                  childRows.reduce((acc, x) => acc + (x[id] as number), 0) / childRows.length,
                ];

              if (m.fn === "sum")
                return [column, childRows.reduce((acc, x) => acc + (x[id] as number), 0)];

              if (m.fn === "min")
                return [column, Math.min(...childRows.map((x) => x[id] as number))];
              if (m.fn === "max")
                return [column, Math.max(...childRows.map((x) => x[id] as number))];
            })
            .filter(Boolean) as [string, number | string][],
        );

        return {
          kind: "branch",
          childCount: childCnt,
          data: aggData,
          id: x[0],
          key: x[0].split(" / ").at(-1)!,
        };
      }),

      path: c.path,
      start: c.start,
      end: c.end,
      size: rows.length,
    } satisfies DataResponse;
  });
}
