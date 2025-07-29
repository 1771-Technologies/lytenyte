export function runWithBackoff(run: () => boolean, times: number[]) {
  const res = run();

  if (!times.length) return;

  const time = times.shift();
  if (!res) setTimeout(() => runWithBackoff(run, times), time);
}
