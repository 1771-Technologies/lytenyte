import { get } from "../get.js";

test("get should return the correct values", () => {
  expect(get({ x: { y: "122" } }, "x.y")).toEqual("122");
  expect(get({ x: { y: [1, 2] } }, "x.y[0]")).toEqual(1);
});

test("handles basic dot notation", () => {
  const obj = { a: 1, b: { c: 2 }, d: { e: { f: 3 } } };
  expect(get(obj, "a")).toBe(1);
  expect(get(obj, "b.c")).toBe(2);
  expect(get(obj, "d.e.f")).toBe(3);
});

test("handles array indexing", () => {
  const obj = {
    users: [
      { id: 1, name: "Alice" },
      { id: 2, name: "Bob" },
    ],
    numbers: [1, 2, 3],
  };
  expect(get(obj, "users[0].name")).toBe("Alice");
  expect(get(obj, "users[1].id")).toBe(2);
  expect(get(obj, "numbers[2]")).toBe(3);
});

test("handles nested arrays", () => {
  const obj = {
    matrix: [
      [1, 2],
      [3, 4],
    ],
    deep: { array: [[{ value: "found" }]] },
  };
  expect(get(obj, "matrix[0][1]")).toBe(2);
  expect(get(obj, "matrix[1][0]")).toBe(3);
  expect(get(obj, "deep.array[0][0].value")).toBe("found");
});

test("handles undefined and null values", () => {
  const obj = {
    a: undefined,
    b: null,
    c: { d: undefined },
    e: { f: null },
  };
  expect(get(obj, "a")).toBeUndefined();
  expect(get(obj, "b")).toBeNull();
  expect(get(obj, "c.d")).toBeUndefined();
  expect(get(obj, "e.f")).toBeNull();
});

test("returns undefined for invalid paths", () => {
  const obj = { a: { b: 1 } };
  expect(get(obj, "x.y")).toBeUndefined();
  expect(get(obj, "a.b.c")).toBeUndefined();
  expect(get(obj, "users[0]")).toBeUndefined();
  expect(get(obj, "a.b[0]")).toBeUndefined();
});

test("handles arrays with nested objects", () => {
  const obj = {
    groups: [
      {
        id: 1,
        members: [
          { id: 1, name: "Alice" },
          { id: 2, name: "Bob" },
        ],
      },
      {
        id: 2,
        members: [{ id: 3, name: "Charlie" }],
      },
    ],
  };
  expect(get(obj, "groups[0].members[1].name")).toBe("Bob");
  expect(get(obj, "groups[1].members[0].name")).toBe("Charlie");
  expect(get(obj, "groups[0].id")).toBe(1);
});

test("handles edge cases with empty strings and numbers", () => {
  const obj = {
    "": { value: "empty string key" },
    0: "zero",
    numbers: {
      "1": "one",
      2: "two",
    },
  };
  expect(get(obj, "0")).toBe("zero");
  expect(get(obj, "numbers.1")).toBe("one");
  expect(get(obj, "numbers.2")).toBe("two");
});
