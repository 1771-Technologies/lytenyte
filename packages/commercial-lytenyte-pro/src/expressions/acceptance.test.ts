import { describe, test, expect } from "vitest";
import { Evaluator } from "./evaluator/evaluate.js";
import { standardPlugins } from "./plugins/standard.js";

const std = new Evaluator(standardPlugins);
const evaluate = (expr: string, context?: Record<string, unknown>) => std.run(expr, context);

// === Literals ===

describe("literals", () => {
  test("Should evaluate integers", () => {
    expect(evaluate("42")).toBe(42);
  });

  test("Should evaluate decimals", () => {
    expect(evaluate("3.14")).toBe(3.14);
  });

  test("Should evaluate numeric separators", () => {
    expect(evaluate("1_000_000")).toBe(1000000);
  });

  test("Should evaluate hex numbers", () => {
    expect(evaluate("0xFF")).toBe(255);
  });

  test("Should evaluate octal numbers", () => {
    expect(evaluate("0o77")).toBe(63);
  });

  test("Should evaluate binary numbers", () => {
    expect(evaluate("0b1010")).toBe(10);
  });

  test("Should evaluate scientific notation", () => {
    expect(evaluate("1e10")).toBe(1e10);
    expect(evaluate("2.5E-3")).toBe(2.5e-3);
  });

  test("Should evaluate double-quoted strings", () => {
    expect(evaluate('"hello world"')).toBe("hello world");
  });

  test("Should evaluate single-quoted strings", () => {
    expect(evaluate("'single quotes'")).toBe("single quotes");
  });

  test("Should evaluate string escape sequences", () => {
    expect(evaluate('"newline\\ntab\\t"')).toBe("newline\ntab\t");
    expect(evaluate('"escaped \\\\\\"quotes\\\\\\""')).toBe('escaped \\"quotes\\"');
  });

  test("Should evaluate hex escape in strings", () => {
    expect(evaluate('"\\x41"')).toBe("A");
  });

  test("Should evaluate unicode escape in strings", () => {
    expect(evaluate('"\\u0041"')).toBe("A");
  });

  test("Should evaluate braced unicode escape in strings", () => {
    expect(evaluate('"\\u{1F600}"')).toBe("\u{1F600}");
  });

  test("Should evaluate template literals", () => {
    expect(evaluate("`hello`")).toBe("hello");
  });

  test("Should evaluate template literals with interpolation", () => {
    expect(evaluate("`hello ${name}`", { name: "world" })).toBe("hello world");
  });

  test("Should evaluate template literals with expressions", () => {
    expect(evaluate("`${a} + ${b} = ${a + b}`", { a: 2, b: 3 })).toBe("2 + 3 = 5");
  });

  test("Should evaluate empty template literal", () => {
    expect(evaluate("``")).toBe("");
  });

  test("Should evaluate true", () => {
    expect(evaluate("true")).toBe(true);
  });

  test("Should evaluate false", () => {
    expect(evaluate("false")).toBe(false);
  });

  test("Should evaluate null", () => {
    expect(evaluate("null")).toBe(null);
  });

  test("Should evaluate undefined", () => {
    expect(evaluate("undefined")).toBe(undefined);
  });
});

// === Identifiers ===

describe("identifiers", () => {
  test("Should resolve identifiers from context", () => {
    expect(evaluate("x", { x: 42 })).toBe(42);
  });

  test("Should return undefined for missing identifiers", () => {
    expect(evaluate("x")).toBe(undefined);
  });

  test("Should resolve underscore identifiers", () => {
    expect(evaluate("_foo", { _foo: "bar" })).toBe("bar");
  });
});

// === Arithmetic ===

describe("arithmetic", () => {
  test("Should add", () => {
    expect(evaluate("a + b", { a: 2, b: 3 })).toBe(5);
  });

  test("Should subtract", () => {
    expect(evaluate("a - b", { a: 10, b: 4 })).toBe(6);
  });

  test("Should multiply", () => {
    expect(evaluate("a * b", { a: 3, b: 7 })).toBe(21);
  });

  test("Should divide", () => {
    expect(evaluate("a / b", { a: 15, b: 4 })).toBe(3.75);
  });

  test("Should modulus", () => {
    expect(evaluate("a % b", { a: 7, b: 3 })).toBe(1);
  });

  test("Should exponentiate", () => {
    expect(evaluate("a ** b", { a: 2, b: 10 })).toBe(1024);
  });

  test("Should respect operator precedence", () => {
    expect(evaluate("a + b * c", { a: 2, b: 3, c: 4 })).toBe(14);
  });

  test("Should respect parenthesized grouping", () => {
    expect(evaluate("(a + b) * c", { a: 2, b: 3, c: 4 })).toBe(20);
  });

  test("Should left-associate subtraction", () => {
    expect(evaluate("a - b - c", { a: 10, b: 3, c: 2 })).toBe(5);
  });

  test("Should right-associate exponentiation", () => {
    expect(evaluate("a ** b ** c", { a: 2, b: 3, c: 2 })).toBe(512);
  });

  test("Should concatenate strings with +", () => {
    expect(evaluate("a + b", { a: "hello ", b: "world" })).toBe("hello world");
  });

  test("Should coerce number to string with + when mixed", () => {
    expect(evaluate("a + b", { a: "count: ", b: 3 })).toBe("count: 3");
  });
});

// === Unary ===

describe("unary", () => {
  test("Should negate a number", () => {
    expect(evaluate("-x", { x: 5 })).toBe(-5);
  });

  test("Should coerce to number with +", () => {
    expect(evaluate("+x", { x: "3" })).toBe(3);
  });

  test("Should logical NOT", () => {
    expect(evaluate("!x", { x: false })).toBe(true);
    expect(evaluate("!x", { x: true })).toBe(false);
  });

  test("Should double negate", () => {
    expect(evaluate("--x", { x: 5 })).toBe(5);
  });
});

// === Comparison ===

describe("comparison", () => {
  test("Should strict equal", () => {
    expect(evaluate("a == b", { a: 1, b: 1 })).toBe(true);
    expect(evaluate("a == b", { a: 1, b: 2 })).toBe(false);
  });

  test("Should strict not equal", () => {
    expect(evaluate("a != b", { a: 1, b: 2 })).toBe(true);
    expect(evaluate("a != b", { a: 1, b: 1 })).toBe(false);
  });

  test("Should not coerce types for equality", () => {
    expect(evaluate("a == b", { a: 1, b: "1" })).toBe(false);
  });

  test("Should compare less than", () => {
    expect(evaluate("a < b", { a: 1, b: 2 })).toBe(true);
    expect(evaluate("a < b", { a: 2, b: 1 })).toBe(false);
  });

  test("Should compare greater than", () => {
    expect(evaluate("a > b", { a: 2, b: 1 })).toBe(true);
  });

  test("Should compare less than or equal", () => {
    expect(evaluate("a <= b", { a: 5, b: 5 })).toBe(true);
    expect(evaluate("a <= b", { a: 6, b: 5 })).toBe(false);
  });

  test("Should compare greater than or equal", () => {
    expect(evaluate("a >= b", { a: 5, b: 5 })).toBe(true);
    expect(evaluate("a >= b", { a: 4, b: 5 })).toBe(false);
  });
});

// === Logical ===

describe("logical", () => {
  test("Should short-circuit AND returning left if falsy", () => {
    expect(evaluate("x && y", { x: false, y: 42 })).toBe(false);
  });

  test("Should short-circuit AND returning right if left truthy", () => {
    expect(evaluate("x && y", { x: true, y: 42 })).toBe(42);
  });

  test("Should short-circuit OR returning left if truthy", () => {
    expect(evaluate("x || y", { x: "hi", y: 42 })).toBe("hi");
  });

  test("Should short-circuit OR returning right if left falsy", () => {
    expect(evaluate("x || y", { x: false, y: 42 })).toBe(42);
  });

  test("Should combine logical operators", () => {
    expect(evaluate("a && b || c", { a: false, b: 1, c: 2 })).toBe(2);
    expect(evaluate("a || b && c", { a: false, b: 1, c: 2 })).toBe(2);
  });
});

// === Nullish Coalescing ===

describe("nullish coalescing", () => {
  test("Should return right when left is null", () => {
    expect(evaluate("x ?? y", { x: null, y: 5 })).toBe(5);
  });

  test("Should return right when left is undefined", () => {
    expect(evaluate("x ?? y", { x: undefined, y: 5 })).toBe(5);
  });

  test("Should preserve falsy non-nullish values", () => {
    expect(evaluate("x ?? y", { x: 0, y: 5 })).toBe(0);
    expect(evaluate("x ?? y", { x: "", y: 5 })).toBe("");
    expect(evaluate("x ?? y", { x: false, y: 5 })).toBe(false);
  });

  test("Should return left when non-nullish", () => {
    expect(evaluate("x ?? y", { x: 42, y: 5 })).toBe(42);
  });
});

// === Ternary ===

describe("ternary", () => {
  test("Should return consequent when truthy", () => {
    expect(evaluate('age >= 18 ? "adult" : "minor"', { age: 25 })).toBe("adult");
  });

  test("Should return alternate when falsy", () => {
    expect(evaluate('age >= 18 ? "adult" : "minor"', { age: 12 })).toBe("minor");
  });

  test("Should nest ternaries", () => {
    expect(evaluate('score > 90 ? "A" : score > 80 ? "B" : "C"', { score: 85 })).toBe("B");
    expect(evaluate('score > 90 ? "A" : score > 80 ? "B" : "C"', { score: 95 })).toBe("A");
    expect(evaluate('score > 90 ? "A" : score > 80 ? "B" : "C"', { score: 70 })).toBe("C");
  });

  test("Should only evaluate the chosen branch", () => {
    let called = false;
    const bomb = () => {
      called = true;
      return "boom";
    };
    evaluate("true ? 1 : bomb()", { bomb });
    expect(called).toBe(false);
  });
});

// === Member Access ===

describe("member access", () => {
  const user = { name: "alice", address: { city: "paris" }, scores: [90, 85, 92] };

  test("Should access dot notation", () => {
    expect(evaluate("user.name", { user })).toBe("alice");
  });

  test("Should access nested dot notation", () => {
    expect(evaluate("user.address.city", { user })).toBe("paris");
  });

  test("Should access bracket notation with number", () => {
    expect(evaluate("user.scores[0]", { user })).toBe(90);
  });

  test("Should access bracket notation with string", () => {
    expect(evaluate('user["name"]', { user })).toBe("alice");
  });

  test("Should access bracket notation with expression", () => {
    expect(evaluate("user[key]", { user, key: "name" })).toBe("alice");
  });

  test("Should access array length", () => {
    expect(evaluate("[1, 2, 3].length")).toBe(3);
  });
});

// === Optional Chaining ===

describe("optional chaining", () => {
  test("Should access property when non-null", () => {
    expect(evaluate("user?.name", { user: { name: "bob" } })).toBe("bob");
  });

  test("Should return undefined when null", () => {
    expect(evaluate("user?.name", { user: null })).toBe(undefined);
  });

  test("Should return undefined when undefined", () => {
    expect(evaluate("user?.name", { user: undefined })).toBe(undefined);
  });

  test("Should chain multiple optional accesses", () => {
    expect(evaluate("a?.b?.c", { a: { b: { c: 42 } } })).toBe(42);
    expect(evaluate("a?.b?.c", { a: {} })).toBe(undefined);
  });

  test("Should support computed optional chaining", () => {
    expect(evaluate("obj?.[key]", { obj: { x: 1 }, key: "x" })).toBe(1);
    expect(evaluate("obj?.[key]", { obj: null, key: "x" })).toBe(undefined);
  });

  test("Should combine with nullish coalescing", () => {
    expect(
      evaluate('config?.theme?.primaryColor ?? config?.fallbackColor ?? "#000"', {
        config: { theme: null, fallbackColor: "#333" },
      }),
    ).toBe("#333");
  });
});

// === Function Calls ===

describe("function calls", () => {
  test("Should call a context function", () => {
    const add = (a: number, b: number) => a + b;
    expect(evaluate("add(1, 2)", { add })).toBe(3);
  });

  test("Should call with no arguments", () => {
    const fn = () => 42;
    expect(evaluate("fn()", { fn })).toBe(42);
  });

  test("Should call with trailing comma", () => {
    const fn = (x: number) => x * 2;
    expect(evaluate("fn(5,)", { fn })).toBe(10);
  });

  test("Should call built-in string methods", () => {
    expect(evaluate('"hello".toUpperCase()')).toBe("HELLO");
  });

  test("Should call string split", () => {
    expect(evaluate('"hello world".split(" ")')).toEqual(["hello", "world"]);
  });

  test("Should call method on object from context", () => {
    const obj = { greet: (name: string) => `hi ${name}` };
    expect(evaluate('obj.greet("alice")', { obj })).toBe("hi alice");
  });

  test("Should call built-in array methods", () => {
    expect(evaluate("[1, 2, 3].map(x => x * 2)")).toEqual([2, 4, 6]);
    expect(evaluate("[1, 2, 3].filter(x => x > 1)")).toEqual([2, 3]);
    expect(evaluate("[3, 1, 2].sort((a, b) => a - b)")).toEqual([1, 2, 3]);
  });

  test("Should call reduce on array", () => {
    expect(evaluate("[1, 2, 3, 4].reduce((acc, x) => acc + x, 0)")).toBe(10);
  });

  test("Should call Math-like functions from context", () => {
    expect(evaluate("max(10, 20, 5)", { max: Math.max })).toBe(20);
    expect(evaluate("min(10, 20, 5)", { min: Math.min })).toBe(5);
  });
});

// === Pipe Expressions ===

describe("pipe expressions", () => {
  const upper = (s: string) => s.toUpperCase();
  const trim = (s: string) => s.trim();
  const add = (a: number, b: number) => a + b;
  const double = (x: number) => x * 2;
  const inc = (x: number) => x + 1;

  test("Should pipe value as sole argument", () => {
    expect(evaluate('"hello" |> upper', { upper })).toBe("HELLO");
  });

  test("Should chain pipes", () => {
    expect(evaluate('"  hello  " |> trim |> upper', { trim, upper })).toBe("HELLO");
  });

  test("Should chain numeric pipes", () => {
    expect(evaluate("5 |> double |> inc", { double, inc })).toBe(11);
  });

  test("Should pipe as last argument", () => {
    expect(evaluate("10 |> add(5)", { add })).toBe(15);
  });

  test("Should pipe with multiple arguments", () => {
    const slice = (start: number, end: number, arr: number[]) => arr.slice(start, end);
    expect(evaluate("[1, 2, 3, 4, 5] |> slice(1, 3)", { slice })).toEqual([2, 3]);
  });

  test("Should pipe with arrow function arguments", () => {
    const filter = (fn: Function, arr: unknown[]) => arr.filter(fn as any);
    expect(evaluate("[1, 2, 3, 4, 5] |> filter(x => x > 2)", { filter })).toEqual([3, 4, 5]);
  });

  test("Should evaluate binary expression before pipe", () => {
    const toString = (x: number) => String(x);
    expect(evaluate("1 + 2 |> toString", { toString })).toBe("3");
  });
});

// === Arrow Functions ===

describe("arrow functions", () => {
  test("Should create single-param arrow", () => {
    const fn = evaluate("x => x * 2") as Function;
    expect(fn(5)).toBe(10);
  });

  test("Should create multi-param arrow", () => {
    const fn = evaluate("(a, b) => a + b") as Function;
    expect(fn(3, 4)).toBe(7);
  });

  test("Should create zero-param arrow", () => {
    const fn = evaluate("() => 42") as Function;
    expect(fn()).toBe(42);
  });

  test("Should capture closure over context", () => {
    const fn = evaluate("x => x + offset", { offset: 100 }) as Function;
    expect(fn(5)).toBe(105);
  });

  test("Should work as argument to pipe", () => {
    const map = (fn: Function, arr: unknown[]) => arr.map(fn as any);
    expect(evaluate("[1, 2, 3] |> map(x => x * 10)", { map })).toEqual([10, 20, 30]);
  });

  test("Should work with ternary in body", () => {
    const fn = evaluate('x => x > 5 ? "big" : "small"') as Function;
    expect(fn(10)).toBe("big");
    expect(fn(2)).toBe("small");
  });

  test("Should work with pipe in body", () => {
    const upper = (s: string) => s.toUpperCase();
    const fn = evaluate("x => x |> upper", { upper }) as Function;
    expect(fn("hello")).toBe("HELLO");
  });
});

// === Array Literals ===

describe("array literals", () => {
  test("Should evaluate empty array", () => {
    expect(evaluate("[]")).toEqual([]);
  });

  test("Should evaluate array with elements", () => {
    expect(evaluate("[1, 2, 3]")).toEqual([1, 2, 3]);
  });

  test("Should evaluate mixed-type array", () => {
    expect(evaluate('[1, "two", true, null]')).toEqual([1, "two", true, null]);
  });

  test("Should evaluate nested arrays", () => {
    expect(evaluate("[[1], [2]]")).toEqual([[1], [2]]);
  });

  test("Should evaluate spread in array", () => {
    expect(evaluate("[...arr]", { arr: [1, 2, 3] })).toEqual([1, 2, 3]);
  });

  test("Should evaluate spread with other elements", () => {
    expect(evaluate("[0, ...rest, 4]", { rest: [1, 2, 3] })).toEqual([0, 1, 2, 3, 4]);
  });

  test("Should evaluate multiple spreads", () => {
    expect(evaluate("[...a, ...b]", { a: [1, 2], b: [3, 4] })).toEqual([1, 2, 3, 4]);
  });

  test("Should evaluate expressions in array elements", () => {
    expect(evaluate("[a + 1, b * 2]", { a: 1, b: 3 })).toEqual([2, 6]);
  });

  test("Should allow trailing comma", () => {
    expect(evaluate("[1, 2, 3,]")).toEqual([1, 2, 3]);
  });
});

// === Object Literals ===

describe("object literals", () => {
  test("Should evaluate empty object", () => {
    expect(evaluate("{}")).toEqual({});
  });

  test("Should evaluate object with properties", () => {
    expect(evaluate('{ name: "alice", age: 30 }')).toEqual({ name: "alice", age: 30 });
  });

  test("Should evaluate shorthand properties", () => {
    expect(evaluate("{ x, y }", { x: 1, y: 2 })).toEqual({ x: 1, y: 2 });
  });

  test("Should evaluate computed properties", () => {
    expect(evaluate("{ [key]: val }", { key: "foo", val: "bar" })).toEqual({ foo: "bar" });
  });

  test("Should evaluate string key properties", () => {
    expect(evaluate('{ "key with spaces": 1 }')).toEqual({ "key with spaces": 1 });
  });

  test("Should allow trailing comma", () => {
    expect(evaluate("{ a: 1, b: 2, }", { a: 1, b: 2 })).toEqual({ a: 1, b: 2 });
  });
});

// === Membership ===

describe("membership", () => {
  test("Should check property existence with in", () => {
    expect(evaluate('"name" in obj', { obj: { name: "alice" } })).toBe(true);
    expect(evaluate('"age" in obj', { obj: { name: "alice" } })).toBe(false);
  });

  test("Should check negated existence with not in", () => {
    expect(evaluate('"age" not in obj', { obj: { name: "alice" } })).toBe(true);
    expect(evaluate('"name" not in obj', { obj: { name: "alice" } })).toBe(false);
  });
});

// === Operator Precedence ===

describe("operator precedence", () => {
  test("Should multiply before add", () => {
    expect(evaluate("a + b * c", { a: 2, b: 3, c: 4 })).toBe(14);
  });

  test("Should evaluate comparison before logical", () => {
    expect(evaluate("a > b && c < d", { a: 5, b: 3, c: 1, d: 2 })).toBe(true);
  });

  test("Should evaluate equality before logical", () => {
    expect(evaluate("a == b || c == d", { a: 1, b: 2, c: 3, d: 3 })).toBe(true);
  });

  test("Should evaluate && before ||", () => {
    expect(evaluate("a || b && c", { a: false, b: true, c: 42 })).toBe(42);
  });

  test("Should evaluate ?? after equality", () => {
    expect(evaluate("a ?? b == c", { a: null, b: 1, c: 1 })).toBe(true);
  });
});

// === Combined / Complex Expressions ===

describe("combined expressions", () => {
  const filter = (fn: Function, arr: unknown[]) => arr.filter(fn as any);
  const map = (fn: Function, arr: unknown[]) => arr.map(fn as any);
  const sort = (fn: Function, arr: unknown[]) => [...arr].sort(fn as any);
  const reduce = (fn: Function, init: unknown, arr: unknown[]) => arr.reduce(fn as any, init);
  const upper = (s: string) => s.toUpperCase();

  test("Should filter, map, and sort with pipes", () => {
    const users = [
      { name: "alice", age: 30 },
      { name: "bob", age: 17 },
      { name: "charlie", age: 25 },
    ];
    expect(
      evaluate("users |> filter(u => u.age >= 18) |> map(u => u.name) |> sort((a, b) => a > b ? 1 : -1)", {
        users,
        filter,
        map,
        sort,
      }),
    ).toEqual(["alice", "charlie"]);
  });

  test("Should map with ternary in template literal", () => {
    const users = [
      { name: "alice", age: 30 },
      { name: "bob", age: 17 },
      { name: "charlie", age: 25 },
    ];
    expect(
      evaluate("users |> map(u => u.age >= 18 ? `${u.name}: adult` : `${u.name}: minor`)", {
        users,
        map,
      }),
    ).toEqual(["alice: adult", "bob: minor", "charlie: adult"]);
  });

  test("Should reduce with pipe", () => {
    expect(evaluate("[1, 2, 3, 4, 5] |> reduce((acc, x) => acc + x, 0)", { reduce })).toBe(15);
  });

  test("Should chain optional chaining with nullish coalescing", () => {
    expect(
      evaluate('config?.theme?.primaryColor ?? config?.fallbackColor ?? "#000"', {
        config: { theme: null, fallbackColor: "#333" },
      }),
    ).toBe("#333");
  });

  test("Should interpolate pipe result in template", () => {
    expect(evaluate("`${greeting |> upper}!`", { greeting: "hello", upper })).toBe("HELLO!");
  });

  test("Should evaluate complex arithmetic with pipe", () => {
    const round = (decimals: number, value: number) => Math.round(value * 10 ** decimals) / 10 ** decimals;
    expect(evaluate("total * (1 + taxRate) |> round(2)", { total: 100, taxRate: 0.075, round })).toBe(107.5);
  });

  test("Should filter with not in", () => {
    expect(
      evaluate("values |> filter(x => x not in excluded)", {
        values: ["a", "b", "c", "d"],
        excluded: { a: true, c: true },
        filter,
      }),
    ).toEqual(["b", "d"]);
  });

  test("Should evaluate ternary with logical and comparison", () => {
    expect(
      evaluate('age >= 18 && verified == true ? "approved" : "denied"', {
        age: 25,
        verified: true,
      }),
    ).toBe("approved");
    expect(
      evaluate('age >= 18 && verified == true ? "approved" : "denied"', {
        age: 25,
        verified: false,
      }),
    ).toBe("denied");
  });

  test("Should sort objects by property with pipe", () => {
    const items = [
      { name: "banana", price: 2 },
      { name: "apple", price: 1 },
      { name: "cherry", price: 3 },
    ];
    expect(
      evaluate("items |> sort((a, b) => a.price - b.price) |> map(x => x.name)", {
        items,
        sort,
        map,
      }),
    ).toEqual(["apple", "banana", "cherry"]);
  });

  test("Should use arrow with built-in array methods", () => {
    expect(evaluate("[1, 2, 3].map(x => x * 2)")).toEqual([2, 4, 6]);
    expect(evaluate("[1, 2, 3, 4, 5].filter(x => x > 3)")).toEqual([4, 5]);
  });

  test("Should evaluate nested object access in template", () => {
    const user = { name: "alice", address: { city: "paris" } };
    expect(evaluate("`${user.name} lives in ${user.address.city}`", { user })).toBe("alice lives in paris");
  });
});

// === Compiler Optimizations ===

describe("compiler optimizations", () => {
  test("Should fold constant arithmetic", () => {
    expect(evaluate("1 + 2")).toBe(3);
    expect(evaluate("(2 * 3) + 4")).toBe(10);
  });

  test("Should fold constant boolean negation", () => {
    expect(evaluate("!false")).toBe(true);
  });

  test("Should eliminate dead branches", () => {
    expect(evaluate('true ? "yes" : "no"')).toBe("yes");
    expect(evaluate('false ? "yes" : "no"')).toBe("no");
  });
});

// === Complex Combined Expressions ===

describe("complex expressions", () => {
  const filter = (fn: Function, arr: unknown[]) => arr.filter(fn as any);
  const map = (fn: Function, arr: unknown[]) => arr.map(fn as any);
  const sort = (fn: Function, arr: unknown[]) => [...arr].sort(fn as any);
  const reduce = (fn: Function, init: unknown, arr: unknown[]) => arr.reduce(fn as any, init);
  const upper = (s: string) => s.toUpperCase();
  const join = (sep: string, arr: unknown[]) => (arr as string[]).join(sep);

  test("Should chain filter, map, sort, reduce in one pipeline", () => {
    const data = [5, 3, 8, 1, 9, 2, 7];
    expect(
      evaluate(
        "data |> filter(x => x > 3) |> sort((a, b) => a - b) |> map(x => x * 10) |> reduce((acc, x) => acc + x, 0)",
        { data, filter, sort, map, reduce },
      ),
    ).toBe(290);
  });

  test("Should build object from computed expressions", () => {
    expect(
      evaluate('{ [prefix + "Name"]: name, [prefix + "Age"]: age }', {
        prefix: "user",
        name: "alice",
        age: 30,
      }),
    ).toEqual({ userName: "alice", userAge: 30 });
  });

  test("Should nest template literals with complex expressions", () => {
    const items = [
      { name: "apple", qty: 3, price: 1.5 },
      { name: "banana", qty: 5, price: 0.75 },
    ];
    expect(
      evaluate("items |> map(i => `${i.name}: ${i.qty} x $${i.price} = $${i.qty * i.price}`)", {
        items,
        map,
      }),
    ).toEqual(["apple: 3 x $1.5 = $4.5", "banana: 5 x $0.75 = $3.75"]);
  });

  test("Should deeply nest optional chaining with fallbacks", () => {
    const config = {
      db: { primary: { host: "localhost" } },
    };
    expect(evaluate('db?.primary?.host ?? db?.secondary?.host ?? "127.0.0.1"', config)).toBe("localhost");
    expect(evaluate("db?.primary?.port ?? db?.secondary?.port ?? 5432", config)).toBe(5432);
  });

  test("Should chain ternaries with member access", () => {
    const user = { role: "admin", permissions: { canDelete: true } };
    expect(
      evaluate('user.role == "admin" ? (user.permissions.canDelete ? "full" : "limited") : "none"', { user }),
    ).toBe("full");
  });

  test("Should pipe arrow return value into another function", () => {
    const apply = (val: unknown, fn: Function) => fn(val);
    expect(evaluate("(x => x * 2) |> apply(10)", { apply })).toBe(20);
  });

  test("Should create and immediately call arrow function via context helper", () => {
    const call = (fn: Function) => fn();
    expect(evaluate("(() => 42) |> call", { call })).toBe(42);
  });

  test("Should use logical operators for default values pattern", () => {
    expect(evaluate("name || defaultName", { name: "", defaultName: "anon" })).toBe("anon");
    expect(evaluate("name ?? defaultName", { name: "", defaultName: "anon" })).toBe("");
  });

  test("Should filter then join with pipe", () => {
    expect(
      evaluate('words |> filter(w => w.length > 3) |> map(w => w |> upper) |> join(", ")', {
        words: ["hi", "hello", "hey", "world", "ok"],
        filter,
        map,
        upper,
        join,
      }),
    ).toBe("HELLO, WORLD");
  });

  test("Should use spread to merge arrays with additional elements", () => {
    expect(
      evaluate("[...before, middle, ...after]", {
        before: [1, 2],
        middle: 3,
        after: [4, 5],
      }),
    ).toEqual([1, 2, 3, 4, 5]);
  });

  test("Should build nested objects", () => {
    expect(
      evaluate("{ user: { name: n, settings: { theme: t } } }", {
        n: "alice",
        t: "dark",
      }),
    ).toEqual({ user: { name: "alice", settings: { theme: "dark" } } });
  });

  test("Should use array method chaining without pipes", () => {
    expect(evaluate("[4, 2, 7, 1, 9, 3].filter(x => x > 3).sort((a, b) => a - b).map(x => x ** 2)")).toEqual([
      16, 49, 81,
    ]);
  });

  test("Should use comparison result in arithmetic", () => {
    expect(evaluate("(a > b) + (c > d)", { a: 5, b: 3, c: 1, d: 2 })).toBe(1);
  });

  test("Should evaluate nested function calls", () => {
    const add = (a: number, b: number) => a + b;
    const mul = (a: number, b: number) => a * b;
    expect(evaluate("add(mul(2, 3), mul(4, 5))", { add, mul })).toBe(26);
  });

  test("Should index arrays with computed expressions", () => {
    expect(evaluate("arr[offset + 1]", { arr: [10, 20, 30, 40], offset: 1 })).toBe(30);
  });

  test("Should use ternary result as function argument", () => {
    const greet = (name: string) => `hi ${name}`;
    expect(evaluate('greet(known ? name : "stranger")', { greet, known: true, name: "alice" })).toBe(
      "hi alice",
    );
    expect(evaluate('greet(known ? name : "stranger")', { greet, known: false, name: "alice" })).toBe(
      "hi stranger",
    );
  });

  test("Should combine template literal with optional chaining", () => {
    expect(evaluate('`Hello, ${user?.name ?? "guest"}!`', { user: { name: "bob" } })).toBe("Hello, bob!");
    expect(evaluate('`Hello, ${user?.name ?? "guest"}!`', { user: null })).toBe("Hello, guest!");
  });

  test("Should chain optional member then call method", () => {
    const obj = { items: [3, 1, 2] };
    expect(evaluate("obj?.items.sort((a, b) => a - b)", { obj })).toEqual([1, 2, 3]);
    expect(evaluate("obj?.items?.sort((a, b) => a - b)", { obj: null })).toBe(undefined);
  });

  test("Should map objects to formatted strings with complex template", () => {
    const users = [
      { first: "Alice", last: "Smith", age: 30 },
      { first: "Bob", last: "Jones", age: 25 },
    ];
    expect(
      evaluate('users |> map(u => `${u.first} ${u.last} (${u.age >= 18 ? "adult" : "minor"})`)', {
        users,
        map,
      }),
    ).toEqual(["Alice Smith (adult)", "Bob Jones (adult)"]);
  });

  test("Should evaluate deeply nested arithmetic with mixed operators", () => {
    expect(
      evaluate("(a + b) * (c - d) / (e % f) ** g", {
        a: 2,
        b: 3,
        c: 10,
        d: 4,
        e: 7,
        f: 4,
        g: 2,
      }),
    ).toBeCloseTo(30 / 9);
  });

  test("Should use not in with optional chaining", () => {
    expect(
      evaluate("key not in (config?.blocked ?? {})", {
        key: "x",
        config: { blocked: { y: true } },
      }),
    ).toBe(true);
    expect(
      evaluate("key not in (config?.blocked ?? {})", {
        key: "y",
        config: { blocked: { y: true } },
      }),
    ).toBe(false);
  });

  test("Should evaluate complex scoring expression", () => {
    const student = { math: 85, english: 72, science: 90 };
    expect(
      evaluate('(student.math + student.english + student.science) / 3 >= 80 ? "pass" : "fail"', {
        student,
      }),
    ).toBe("pass");
  });

  test("Should build array from ternary and spread", () => {
    expect(
      evaluate("[...base, ...(includeExtra ? extra : [])]", {
        base: [1, 2],
        includeExtra: true,
        extra: [3, 4],
      }),
    ).toEqual([1, 2, 3, 4]);
    expect(
      evaluate("[...base, ...(includeExtra ? extra : [])]", {
        base: [1, 2],
        includeExtra: false,
        extra: [3, 4],
      }),
    ).toEqual([1, 2]);
  });

  test("Should chain multiple string method calls", () => {
    expect(evaluate('"  Hello World  ".trim().toLowerCase().split(" ")')).toEqual(["hello", "world"]);
  });

  test("Should use pipe with method-based transforms", () => {
    expect(
      evaluate(
        'words |> filter(w => w.length > 0) |> map(w => w[0].toUpperCase() + w.slice(1)) |> join(" ")',
        { words: ["hello", "world"], filter, map, join },
      ),
    ).toBe("Hello World");
  });

  test("Should evaluate fibonacci-like expression chain", () => {
    expect(
      evaluate("[0, 1, a + b, a + b + (a + b), a + b + (a + b) + (a + b + (a + b))]", {
        a: 0,
        b: 1,
      }),
    ).toEqual([0, 1, 1, 2, 4]);
  });

  test("Should partition array with two filters", () => {
    const nums = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    const evens = evaluate("nums |> filter(x => x % 2 == 0)", { nums, filter });
    const odds = evaluate("nums |> filter(x => x % 2 != 0)", { nums, filter });
    expect(evens).toEqual([2, 4, 6, 8, 10]);
    expect(odds).toEqual([1, 3, 5, 7, 9]);
  });

  test("Should transform nested data structure", () => {
    const departments = [
      { name: "Engineering", employees: [{ name: "Alice" }, { name: "Bob" }] },
      { name: "Design", employees: [{ name: "Charlie" }] },
    ];
    expect(
      evaluate(
        'departments |> map(d => { dept: d.name, count: d.employees.length, names: d.employees |> map(e => e.name) |> join(", ") })',
        { departments, map, join },
      ),
    ).toEqual([
      { dept: "Engineering", count: 2, names: "Alice, Bob" },
      { dept: "Design", count: 1, names: "Charlie" },
    ]);
  });

  test("Should evaluate expression with every operator category", () => {
    // arithmetic + comparison + logical + ternary + member + call + template + nullish
    const ctx = {
      user: { name: "alice", age: 30, score: null as number | null },
      threshold: 18,
      bonus: 10,
      upper,
    };
    expect(
      evaluate(
        '`${user.name |> upper}: ${user.age >= threshold && (user.score ?? 0) + bonus > 5 ? "qualified" : "rejected"}`',
        ctx,
      ),
    ).toBe("ALICE: qualified");
  });
});
