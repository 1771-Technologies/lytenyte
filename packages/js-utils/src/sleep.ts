export function sleep(ms: number = 200) {
  return new Promise((res) => setTimeout(res, ms));
}

export function wait(ms: number = 20) {
  return sleep(ms);
}
