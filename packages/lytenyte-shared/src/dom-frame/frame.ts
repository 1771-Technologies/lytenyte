// reference https://github.com/pmndrs/rafz
import type { FrameFn, FrameUpdateFn, Frame, Timeout } from "./types";

const updateQueue = makeQueue<FrameUpdateFn>();

/**
 * Schedule an update for next frame.
 * Your function can return `true` to repeat next frame.
 */
export const frame: Frame = (fn) => schedule(fn, updateQueue);

const writeQueue = makeQueue<FrameFn>();
frame.write = (fn) => schedule(fn, writeQueue);

const onStartQueue = makeQueue<FrameFn>();
frame.onStart = (fn) => schedule(fn, onStartQueue);

const onFrameQueue = makeQueue<FrameFn>();
frame.onFrame = (fn) => schedule(fn, onFrameQueue);

const onFinishQueue = makeQueue<FrameFn>();
frame.onFinish = (fn) => schedule(fn, onFinishQueue);

const timeouts: Timeout[] = [];
/** Schedules a handler to run on the soonest frame after the given delay and returns a Timeout that can be cancelled. */
frame.setTimeout = (handler, ms) => {
  const time = frame.now() + ms;
  /** Removes this timeout from the queue if it has not already fired. */
  const cancel = () => {
    const i = timeouts.findIndex((t) => t.cancel == cancel);
    if (~i) timeouts.splice(i, 1);
    pendingCount -= ~i ? 1 : 0;
  };

  const timeout: Timeout = { time, handler, cancel };
  timeouts.splice(findTimeout(time), 0, timeout);
  pendingCount += 1;

  start();
  return timeout;
};

/** Find the index where the given time is not greater. */
const findTimeout = (time: number) => ~(~timeouts.findIndex((t) => t.time > time) || ~timeouts.length);

/** Removes a function from every queue it may have been added to, preventing it from running on the next frame. */
frame.cancel = (fn) => {
  onStartQueue.delete(fn);
  onFrameQueue.delete(fn);
  onFinishQueue.delete(fn);
  updateQueue.delete(fn);
  writeQueue.delete(fn);
};

/** Runs the given function immediately, executing any functions scheduled inside it synchronously rather than deferring them to the next frame. */
frame.sync = (fn) => {
  sync = true;
  frame.batchedUpdates(fn);
  sync = false;
};

/** Wraps a function so it executes at most once per frame, always using the arguments from the most recent call. */
frame.throttle = (fn) => {
  let lastArgs: any;
  /** Invokes the original function with the most recently captured arguments, then clears them. */
  function queuedFn() {
    try {
      fn(...lastArgs);
    } finally {
      lastArgs = null;
    }
  }
  /** Captures the latest arguments and schedules the queued function to run at the start of the next frame. */
  function throttled(...args: any) {
    lastArgs = args;
    frame.onStart(queuedFn);
  }
  throttled.handler = fn;
  /** Removes the pending queued call and discards any captured arguments. */
  throttled.cancel = () => {
    onStartQueue.delete(queuedFn);
    lastArgs = null;
  };
  return throttled as any;
};

frame.now = () => performance.now();
frame.batchedUpdates = (fn) => fn();
frame.catch = console.error;

frame.frameLoop = "always";

/** Manually processes one frame of pending work. Only valid when `frameLoop` is set to `"demand"`; warns and does nothing otherwise. */
frame.advance = () => {
  if (frame.frameLoop !== "demand") {
    console.warn("Cannot call the manual advancement of rafz whilst frameLoop is not set as demand");
  } else {
    update();
  }
};

/** The most recent timestamp. */
let ts = -1;

/** The number of pending tasks  */
let pendingCount = 0;

/** When true, scheduling is disabled. */
let sync = false;

/**
 * Adds a function to the given queue and starts the frame loop, or runs it
 * immediately when sync mode is active.
 */
function schedule<T extends (...args: any) => any>(fn: T, queue: Queue<T>) {
  if (sync) {
    queue.delete(fn);
    fn(0);
  } else {
    queue.add(fn);
    start();
  }
}

/** Marks the loop as active and schedules the first animation frame unless running in demand mode. Does nothing if the loop is already running. */
function start() {
  if (ts < 0) {
    ts = 0;
    if (frame.frameLoop !== "demand") {
      requestAnimationFrame(loop);
    }
  }
}

/** Marks the loop as inactive by resetting the timestamp, causing the next `start` call to re-schedule an animation frame. */
function stop() {
  ts = -1;
}

/** The animation frame callback that reschedules itself and processes pending work each frame for as long as the loop remains active. */
function loop() {
  if (~ts) {
    requestAnimationFrame(loop);
    frame.batchedUpdates(update);
  }
}

/**
 * Processes one frame of work: fires any elapsed timeouts, then flushes every
 * queue in order (onStart → update → onFrame → write → onFinish). Stops the
 * loop automatically when all queues are empty.
 */
function update() {
  const prevTs = ts;
  ts = frame.now();

  // Flush timeouts whose time is up.
  const count = findTimeout(ts);
  if (count) {
    eachSafely(timeouts.splice(0, count), (t) => t.handler());
    pendingCount -= count;
  }

  if (!pendingCount) {
    stop();

    return;
  }

  onStartQueue.flush();
  updateQueue.flush(prevTs ? Math.min(64, ts - prevTs) : 16.667);
  onFrameQueue.flush();
  writeQueue.flush();
  onFinishQueue.flush();
}

interface Queue<T extends (...args: any) => any = any> {
  add: (fn: T) => void;
  delete: (fn: T) => boolean;
  flush: (arg?: any) => void;
}

/**
 * Creates a double-buffered queue that safely handles functions added or
 * removed while the queue is being flushed. Functions that return true during
 * flush are automatically re-queued for the following frame.
 */
function makeQueue<T extends (...args: any) => any>(): Queue<T> {
  let next = new Set<T>();
  let current = next;
  return {
    /** Adds the function to the next set and increments the pending count if it is not already present. */
    add(fn) {
      pendingCount += current == next && !next.has(fn) ? 1 : 0;
      next.add(fn);
    },
    /** Removes the function from the next set and decrements the pending count if it was present. */
    delete(fn) {
      pendingCount -= current == next && next.has(fn) ? 1 : 0;
      return next.delete(fn);
    },
    /** Calls every function in the current set, passing the optional argument. Functions that return true are kept in the queue for the next flush. */
    flush(arg) {
      if (current.size) {
        next = new Set();
        pendingCount -= current.size;
        eachSafely(current, (fn) => fn(arg) && next.add(fn));
        pendingCount += next.size;
        current = next;
      }
    },
  };
}

interface Eachable<T> {
  forEach(cb: (value: T) => void): void;
}

/** Iterates over every value and calls the callback, routing any thrown errors to `frame.catch` so that one failure does not prevent the rest from running. */
function eachSafely<T>(values: Eachable<T>, each: (value: T) => void) {
  values.forEach((value) => {
    try {
      each(value);
    } catch (e) {
      frame.catch(e as Error);
    }
  });
}
