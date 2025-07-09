export function runWithBackoff(run: () => boolean, times: number[]) {
  const res = run();

  const time = times.shift();
  if (!res) setTimeout(() => runWithBackoff(run, times), time);
}
