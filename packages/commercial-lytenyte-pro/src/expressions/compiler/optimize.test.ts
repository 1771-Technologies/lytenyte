import { describe, test, expect } from "vitest";
import { optimize as rawOptimize } from "./optimize.js";
import type { ASTNode } from "../parser/types";
import { standardPlugins } from "../plugins/standard.js";

const optimize = (node: ASTNode, plugins = standardPlugins) => rawOptimize(node, plugins);

describe("optimize", () => {
  test("Should fold constant binary addition", () => {
    const node: ASTNode = {
      type: "BinaryExpression",
      operator: "+",
      left: { type: "NumberLiteral", value: 1, start: 0, end: 1 },
      right: { type: "NumberLiteral", value: 2, start: 4, end: 5 },
      start: 0,
      end: 5,
    };
    expect(optimize(node)).toMatchObject({
      type: "NumberLiteral",
      value: 3,
    });
  });

  test("Should not fold binary expression with non-constant operand", () => {
    const node: ASTNode = {
      type: "BinaryExpression",
      operator: "+",
      left: { type: "Identifier", name: "x", start: 0, end: 1 },
      right: { type: "NumberLiteral", value: 2, start: 4, end: 5 },
      start: 0,
      end: 5,
    };
    expect(optimize(node)).toMatchObject({
      type: "BinaryExpression",
      operator: "+",
    });
  });

  test("Should not fold when evalConstant returns undefined", () => {
    const node: ASTNode = {
      type: "BinaryExpression",
      operator: "in",
      left: { type: "NumberLiteral", value: 1, start: 0, end: 1 },
      right: { type: "NumberLiteral", value: 2, start: 4, end: 5 },
      start: 0,
      end: 5,
    };
    expect(optimize(node)).toMatchObject({
      type: "BinaryExpression",
      operator: "in",
    });
  });

  test("Should eliminate dead branch with truthy test", () => {
    const node: ASTNode = {
      type: "ConditionalExpression",
      test: { type: "BooleanLiteral", value: true, start: 0, end: 4 },
      consequent: { type: "NumberLiteral", value: 1, start: 7, end: 8 },
      alternate: { type: "NumberLiteral", value: 2, start: 11, end: 12 },
      start: 0,
      end: 12,
    };
    expect(optimize(node)).toMatchObject({
      type: "NumberLiteral",
      value: 1,
    });
  });

  test("Should eliminate dead branch with falsy test", () => {
    const node: ASTNode = {
      type: "ConditionalExpression",
      test: { type: "NullLiteral", value: null, start: 0, end: 4 },
      consequent: { type: "NumberLiteral", value: 1, start: 7, end: 8 },
      alternate: { type: "NumberLiteral", value: 2, start: 11, end: 12 },
      start: 0,
      end: 12,
    };
    expect(optimize(node)).toMatchObject({
      type: "NumberLiteral",
      value: 2,
    });
  });

  test("Should optimize all branches of non-constant conditional", () => {
    const node: ASTNode = {
      type: "ConditionalExpression",
      test: { type: "Identifier", name: "x", start: 0, end: 1 },
      consequent: {
        type: "BinaryExpression",
        operator: "+",
        left: { type: "NumberLiteral", value: 1, start: 4, end: 5 },
        right: { type: "NumberLiteral", value: 2, start: 8, end: 9 },
        start: 4,
        end: 9,
      },
      alternate: { type: "NumberLiteral", value: 0, start: 12, end: 13 },
      start: 0,
      end: 13,
    };
    const result = optimize(node);
    expect(result).toMatchObject({
      type: "ConditionalExpression",
      consequent: { type: "NumberLiteral", value: 3 },
    });
  });

  test("Should fold unary boolean negation", () => {
    const node: ASTNode = {
      type: "UnaryExpression",
      operator: "!",
      operand: { type: "BooleanLiteral", value: true, start: 1, end: 5 },
      start: 0,
      end: 5,
    };
    expect(optimize(node)).toMatchObject({
      type: "BooleanLiteral",
      value: false,
    });
  });

  test("Should fold unary numeric negation", () => {
    const node: ASTNode = {
      type: "UnaryExpression",
      operator: "-",
      operand: { type: "NumberLiteral", value: 5, start: 1, end: 2 },
      start: 0,
      end: 2,
    };
    expect(optimize(node)).toMatchObject({
      type: "NumberLiteral",
      value: -5,
    });
  });

  test("Should not fold unary with non-matching type", () => {
    const node: ASTNode = {
      type: "UnaryExpression",
      operator: "!",
      operand: { type: "NumberLiteral", value: 1, start: 1, end: 2 },
      start: 0,
      end: 2,
    };
    expect(optimize(node)).toMatchObject({
      type: "UnaryExpression",
      operator: "!",
    });
  });

  test("Should not fold unary with non-constant operand", () => {
    const node: ASTNode = {
      type: "UnaryExpression",
      operator: "-",
      operand: { type: "Identifier", name: "x", start: 1, end: 2 },
      start: 0,
      end: 2,
    };
    expect(optimize(node)).toMatchObject({
      type: "UnaryExpression",
      operator: "-",
    });
  });

  test("Should optimize pipe expression children", () => {
    const node: ASTNode = {
      type: "PipeExpression",
      input: {
        type: "BinaryExpression",
        operator: "+",
        left: { type: "NumberLiteral", value: 1, start: 0, end: 1 },
        right: { type: "NumberLiteral", value: 2, start: 4, end: 5 },
        start: 0,
        end: 5,
      },
      transform: { type: "Identifier", name: "upper", start: 9, end: 14 },
      start: 0,
      end: 14,
    };
    expect(optimize(node)).toMatchObject({
      type: "PipeExpression",
      input: { type: "NumberLiteral", value: 3 },
    });
  });

  test("Should optimize array literal elements", () => {
    const node: ASTNode = {
      type: "ArrayLiteral",
      elements: [
        {
          type: "BinaryExpression",
          operator: "+",
          left: { type: "NumberLiteral", value: 1, start: 1, end: 2 },
          right: { type: "NumberLiteral", value: 2, start: 5, end: 6 },
          start: 1,
          end: 6,
        },
      ],
      start: 0,
      end: 7,
    };
    expect(optimize(node)).toMatchObject({
      type: "ArrayLiteral",
      elements: [{ type: "NumberLiteral", value: 3 }],
    });
  });

  test("Should optimize call expression arguments", () => {
    const node: ASTNode = {
      type: "CallExpression",
      callee: { type: "Identifier", name: "fn", start: 0, end: 2 },
      args: [
        {
          type: "BinaryExpression",
          operator: "*",
          left: { type: "NumberLiteral", value: 2, start: 3, end: 4 },
          right: { type: "NumberLiteral", value: 3, start: 7, end: 8 },
          start: 3,
          end: 8,
        },
      ],
      start: 0,
      end: 9,
    };
    expect(optimize(node)).toMatchObject({
      type: "CallExpression",
      args: [{ type: "NumberLiteral", value: 6 }],
    });
  });

  test("Should optimize member expression object", () => {
    const node: ASTNode = {
      type: "MemberExpression",
      object: {
        type: "BinaryExpression",
        operator: "+",
        left: { type: "NumberLiteral", value: 1, start: 0, end: 1 },
        right: { type: "NumberLiteral", value: 2, start: 4, end: 5 },
        start: 0,
        end: 5,
      },
      property: { type: "Identifier", name: "x", start: 6, end: 7 },
      computed: false,
      start: 0,
      end: 7,
    };
    expect(optimize(node)).toMatchObject({
      type: "MemberExpression",
      object: { type: "NumberLiteral", value: 3 },
      property: { type: "Identifier", name: "x" },
    });
  });

  test("Should optimize computed member expression property", () => {
    const node: ASTNode = {
      type: "MemberExpression",
      object: { type: "Identifier", name: "a", start: 0, end: 1 },
      property: {
        type: "BinaryExpression",
        operator: "+",
        left: { type: "NumberLiteral", value: 0, start: 2, end: 3 },
        right: { type: "NumberLiteral", value: 1, start: 6, end: 7 },
        start: 2,
        end: 7,
      },
      computed: true,
      start: 0,
      end: 8,
    };
    expect(optimize(node)).toMatchObject({
      type: "MemberExpression",
      property: { type: "NumberLiteral", value: 1 },
    });
  });

  test("Should optimize optional member expression object", () => {
    const node: ASTNode = {
      type: "OptionalMemberExpression",
      object: {
        type: "BinaryExpression",
        operator: "+",
        left: { type: "NumberLiteral", value: 1, start: 0, end: 1 },
        right: { type: "NumberLiteral", value: 2, start: 4, end: 5 },
        start: 0,
        end: 5,
      },
      property: { type: "Identifier", name: "x", start: 7, end: 8 },
      computed: false,
      start: 0,
      end: 8,
    };
    expect(optimize(node)).toMatchObject({
      type: "OptionalMemberExpression",
      object: { type: "NumberLiteral", value: 3 },
      property: { type: "Identifier", name: "x" },
    });
  });

  test("Should optimize arrow function body", () => {
    const node: ASTNode = {
      type: "ArrowFunctionExpression",
      params: ["x"],
      body: {
        type: "BinaryExpression",
        operator: "+",
        left: { type: "NumberLiteral", value: 1, start: 1, end: 2 },
        right: { type: "NumberLiteral", value: 2, start: 5, end: 6 },
        start: 1,
        end: 6,
      },
      start: 0,
      end: 6,
    };
    expect(optimize(node)).toMatchObject({
      type: "ArrowFunctionExpression",
      body: { type: "NumberLiteral", value: 3 },
    });
  });

  test("Should return leaf nodes unchanged", () => {
    const id: ASTNode = { type: "Identifier", name: "x", start: 0, end: 1 };
    expect(optimize(id)).toBe(id);
  });

  test("Should return literal nodes unchanged", () => {
    const num: ASTNode = { type: "NumberLiteral", value: 42, start: 0, end: 2 };
    expect(optimize(num)).toBe(num);
  });

  test("Should use plugin optimize hook for custom node types", () => {
    const plugin = {
      name: "test",
      optimize: (node: any, opt: (n: any) => any) => {
        if (node.type === "CustomNode") {
          return { ...node, child: opt(node.child) };
        }
        return null;
      },
    };
    const node = {
      type: "CustomNode",
      child: {
        type: "BinaryExpression",
        operator: "+",
        left: { type: "NumberLiteral", value: 1, start: 0, end: 1 },
        right: { type: "NumberLiteral", value: 2, start: 4, end: 5 },
        start: 0,
        end: 5,
      },
      start: 0,
      end: 5,
    } as any;
    const result = rawOptimize(node, [plugin]) as any;
    expect(result.child).toMatchObject({ type: "NumberLiteral", value: 3 });
  });

  test("Should pass through unknown node when plugin declines", () => {
    const plugin = { name: "noop", optimize: () => null };
    const node = { type: "CustomNode", start: 0, end: 1 } as any;
    expect(rawOptimize(node, [plugin])).toBe(node);
  });

  test("Should fold nested constant expressions", () => {
    const node: ASTNode = {
      type: "BinaryExpression",
      operator: "+",
      left: {
        type: "BinaryExpression",
        operator: "*",
        left: { type: "NumberLiteral", value: 2, start: 0, end: 1 },
        right: { type: "NumberLiteral", value: 3, start: 4, end: 5 },
        start: 0,
        end: 5,
      },
      right: { type: "NumberLiteral", value: 4, start: 8, end: 9 },
      start: 0,
      end: 9,
    };
    expect(optimize(node)).toMatchObject({
      type: "NumberLiteral",
      value: 10,
    });
  });

  test("Should not fold unary negation of string constant", () => {
    const node: ASTNode = {
      type: "UnaryExpression",
      operator: "-",
      operand: { type: "StringLiteral", value: "x", start: 1, end: 4 },
      start: 0,
      end: 4,
    };
    expect(optimize(node)).toMatchObject({
      type: "UnaryExpression",
      operator: "-",
    });
  });
});
