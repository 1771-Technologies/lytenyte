import { debounce } from "./debounce.js";

beforeEach(() => {
  vi.useFakeTimers();
});

afterEach(() => {
  vi.useRealTimers();
});

test("Should not immediately call the function", () => {
  const fn = vi.fn();

  const dfn = debounce(fn, 200);

  dfn();
  expect(fn).not.toHaveBeenCalled();

  vi.advanceTimersByTime(100);
  expect(fn).not.toHaveBeenCalled();

  vi.advanceTimersByTime(99);
  expect(fn).not.toHaveBeenCalled();

  vi.advanceTimersByTime(1);
  expect(fn).toHaveBeenCalledOnce();
});

test("Multiple calls should delay the timer", () => {
  const fn = vi.fn();
  const dfn = debounce(fn, 200);

  dfn();
  expect(fn).not.toHaveBeenCalled();
  vi.advanceTimersByTime(150);

  dfn();
  vi.advanceTimersByTime(150);
  expect(fn).not.toHaveBeenCalled();

  vi.advanceTimersByTime(150);
  expect(fn).toHaveBeenCalledOnce();
});

test("Should be able to call on the leading edge", () => {
  const fn = vi.fn();
  const dfn = debounce(fn, 200, { leading: true });

  dfn();
  expect(fn).toHaveBeenCalledOnce();
  vi.advanceTimersByTime(200);
  expect(fn).toHaveBeenCalledOnce();
  vi.advanceTimersByTime(200);
  expect(fn).toHaveBeenCalledOnce();
});

test("Should be able to call on the leading and trailing edge", () => {
  const fn = vi.fn();
  const dfn = debounce(fn, 200, { leading: true });

  dfn();
  dfn();
  expect(fn).toHaveBeenCalledOnce();
  vi.advanceTimersByTime(200);
  expect(fn).toHaveBeenCalledTimes(2);
  vi.advanceTimersByTime(200);
  expect(fn).toHaveBeenCalledTimes(2);
});

test("Should be able to cancel a call", () => {
  const fn = vi.fn();
  const dfn = debounce(fn, 200);

  dfn();
  expect(fn).not.toHaveBeenCalled();
  vi.advanceTimersByTime(100);
  dfn.cancel();
  vi.advanceTimersByTime(200);
  expect(fn).not.toHaveBeenCalled();
});

test("Should be able to flush the debounce", () => {
  const fn = vi.fn();
  const dfn = debounce(fn, 200);
  dfn();
  expect(fn).not.toHaveBeenCalled();
  vi.advanceTimersByTime(100);
  dfn.flush();
  expect(fn).toHaveBeenCalledOnce();
});

test("Should handle 0 wait time", () => {
  const fn = vi.fn();
  const dfn = debounce(fn, 0);
  dfn();
  vi.advanceTimersByTime(0);
  expect(fn).toHaveBeenCalledOnce();
});

test("Leading and trailing false results in no calls", () => {
  const fn = vi.fn();
  const dfn = debounce(fn, 200, { leading: false, trailing: false });

  dfn();
  vi.advanceTimersByTime(200);
  expect(fn).not.toHaveBeenCalledOnce();
  vi.advanceTimersByTime(200);
  expect(fn).not.toHaveBeenCalledOnce();
});

test("Should be able to make subsequent calls", () => {
  const fn = vi.fn();
  const dfn = debounce(fn, 200);

  dfn();
  vi.advanceTimersByTime(200);
  expect(fn).toHaveBeenCalledOnce();

  dfn();
  vi.advanceTimersByTime(200);
  expect(fn).toHaveBeenCalledTimes(2);
});
