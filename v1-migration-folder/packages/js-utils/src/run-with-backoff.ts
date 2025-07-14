export function runWithBackoff(run: () => boolean, times: number[]) {
  if (!times.length) return;

  const res = run();

  const time = times.shift();
  if (!res) setTimeout(() => runWithBackoff(run, times), time);
}
