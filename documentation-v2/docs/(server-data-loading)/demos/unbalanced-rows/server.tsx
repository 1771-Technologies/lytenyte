import type {
  DataRequest,
  DataResponse,
  DataResponseBranchItem,
  DataResponseLeafItem,
} from "@1771technologies/lytenyte-pro";
import { data } from "./data.js";

const sleep = () => new Promise((res) => setTimeout(res, 600));

export async function Server(reqs: DataRequest[]) {
  // Simulate latency and server work.
  await sleep();

  return reqs.map((c) => {
    let pathNode = data;
    for (const p of c.path) {
      pathNode = pathNode[p!];
    }

    const rows = Object.entries(pathNode);

    return {
      asOfTime: Date.now(),
      data: rows.map<DataResponseLeafItem | DataResponseBranchItem>(([name, file]) => {
        if ("kind" in file) return { kind: "leaf", id: name, data: { ...file, name, depth: c.path.length } };

        return {
          kind: "branch",
          childCount: Object.values(file).length,
          data: { name },
          id: name,
          key: name,
        };
      }),
      start: 0,
      end: rows.length,
      kind: "center",
      path: c.path,
      size: rows.length,
    } satisfies DataResponse;
  });
}
