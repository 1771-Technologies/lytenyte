export function sleep(ms: number = 20) {
  return new Promise((res) => setTimeout(res, ms));
}
