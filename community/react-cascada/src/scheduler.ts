/**
 * A utility for scheduling and managing microtasks in a queue.
 * Tasks are executed in FIFO order on the microtask queue, ensuring they run
 * after the current synchronous execution but before the next macrotask.
 *
 * @example
 * ```typescript
 * import { addTask } from './taskScheduler';
 *
 * addTask(() => console.log('This will run in the microtask queue'));
 * console.log('This runs first');
 * ```
 */

/** Array to store pending task functions */
const tasks: (() => void)[] = [];
const tasksQueues = new Set<() => void>();

/** Flags to track scheduler state */
let scheduled = false;

/**
 * Schedules the task runner on the microtask queue if there are pending tasks
 * and no schedule is currently in progress.
 *
 * @internal
 */
function schedule(): void {
  if (scheduled || !tasks.length) return;

  scheduled = true;
  queueMicrotask(() => {
    scheduled = false;
    run();
  });
}

/**
 * Executes all pending tasks in the queue.
 * Guards against concurrent execution and handles errors in individual tasks.
 *
 * @internal
 */
function run(): void {
  try {
    while (tasks.length > 0) {
      const task = tasks.shift()!;

      tasksQueues.delete(task);

      try {
        task();
      } catch (error) {
        console.error("Error executing task:", error);
        // Continue processing other tasks even if one fails
      }
    }
  } finally {
    // Intentionally empty
  }
}

/**
 * Adds a new task to the queue and schedules execution.
 *
 * @param task - Function to be executed in the microtask queue
 *
 * @example
 * ```typescript
 * addTask(() => {
 *   // This code will run in the microtask queue
 *   processData();
 * });
 * ```
 */
export function addTask(task: () => void): void {
  if (typeof task !== "function") {
    throw new TypeError("Task must be a function");
  }

  // Guard against duplicate tasks being added.
  if (tasksQueues.has(task)) {
    return;
  }

  tasks.push(task);
  tasksQueues.add(task);
  schedule();
}
