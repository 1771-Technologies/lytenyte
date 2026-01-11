import type { DEXPerformanceData } from "@1771technologies/grid-sample-data/dex-pairs-performance";

export function tickDexData(data: DEXPerformanceData[]): DEXPerformanceData[] {
  const nextData: DEXPerformanceData[] = data.map((row) => {
    // Randomly update the row half the time
    if (Math.random() > 0.5) return row;

    const change = Math.random() / 100;
    const changeSign = Math.random() > 0.5 ? -1 : 1;

    return { ...row, change24h: row.change24h + change * changeSign } as DEXPerformanceData;
  });

  return nextData;
}
