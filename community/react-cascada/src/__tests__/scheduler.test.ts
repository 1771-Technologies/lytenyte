import { addTask } from "../scheduler.js";

describe("TaskScheduler", () => {
  beforeEach(() => {
    // Clear any mocked functions
    vi.clearAllMocks();
    // Mock console.error
    vi.spyOn(console, "error").mockImplementation(() => {});
  });

  afterEach(() => {
    // Restore console mocks
    vi.restoreAllMocks();
  });

  test("executes tasks in FIFO order", async () => {
    const results: number[] = [];

    addTask(() => results.push(1));
    addTask(() => results.push(2));
    addTask(() => results.push(3));

    // Wait for microtasks to complete
    await Promise.resolve();

    expect(results).toEqual([1, 2, 3]);
  });

  test("does not add duplicate tasks", async () => {
    const results: number[] = [];
    const task = () => results.push(1);

    addTask(task);
    addTask(task); // Should be ignored
    addTask(task); // Should be ignored

    await Promise.resolve();

    expect(results).toEqual([1]);
  });

  test("handles task errors and continues processing", async () => {
    const results: number[] = [];
    const errorSpy = vi.spyOn(console, "error");

    addTask(() => results.push(1));
    addTask(() => {
      throw new Error("Task error");
    });
    addTask(() => results.push(2));

    await Promise.resolve();

    expect(results).toEqual([1, 2]);
    expect(errorSpy).toHaveBeenCalledWith("Error executing task:", expect.any(Error));
  });

  test("throws TypeError for non-function tasks", () => {
    expect(() => {
      // @ts-expect-error Testing invalid input
      addTask("not a function");
    }).toThrow(TypeError);

    expect(() => {
      // @ts-expect-error Testing invalid input
      addTask(123);
    }).toThrow(TypeError);
  });

  test("handles concurrent task additions", async () => {
    const results: number[] = [];

    addTask(() => {
      results.push(1);
      // Add more tasks while processing
      addTask(() => results.push(3));
    });
    addTask(() => results.push(2));

    await Promise.resolve();
    await Promise.resolve(); // Additional cycle for newly added tasks

    expect(results).toEqual([1, 2, 3]);
  });

  test("processes tasks added during execution", async () => {
    const results: number[] = [];

    addTask(() => {
      results.push(1);
      addTask(() => results.push(3));
      addTask(() => results.push(4));
    });
    addTask(() => {
      results.push(2);
      addTask(() => results.push(5));
    });

    await Promise.resolve();
    await Promise.resolve(); // Additional cycle for newly added tasks

    expect(results).toEqual([1, 2, 3, 4, 5]);
  });

  test("maintains task order when tasks add new tasks", async () => {
    const results: number[] = [];

    const addNestedTask = (id: number, nest: boolean = true) => {
      results.push(id);
      if (nest) {
        addTask(() => addNestedTask(id + 1, false));
      }
    };

    addTask(() => addNestedTask(1));
    addTask(() => addNestedTask(3));

    await Promise.resolve();
    await Promise.resolve(); // Additional cycle for nested tasks

    expect(results).toEqual([1, 3, 2, 4]);
  });
});
