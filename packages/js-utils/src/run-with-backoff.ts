export function runWithBackoff(run: () => boolean, times: number[]) {
  const res = run();

  if (!times.length || res) return;

  const time = times.shift();
  setTimeout(() => runWithBackoff(run, times), time);
}
