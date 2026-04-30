import { describe, test, expect } from "vitest";
import { quotedIdentifierPlugin } from "./quoted-identifier.js";
import { Evaluator } from "../evaluator/evaluate.js";
import { standardPlugins } from "./standard.js";
import { createResolvedIdentifierPlugin } from "./resolved-identifier.js";
import { tokenize, tokenizeSafe } from "../lexer/tokenize/tokenize.js";
import type { ParserContext } from "../parser/parser-context.js";

const plugins = [quotedIdentifierPlugin, ...standardPlugins];
const evaluator = new Evaluator(plugins);
const run = (expr: string, context?: Record<string, unknown>) =>
  evaluator.run(expr, context, { undefinedIdentifierFallback: undefined });

function makeCtx(source: string): ParserContext {
  return { tokens: tokenize(source, plugins), pos: 0, source, depth: 0, plugins };
}

describe("quotedIdentifierPlugin", () => {
  test("Should have name 'quoted-identifier'", () => {
    expect(quotedIdentifierPlugin.name).toBe("quoted-identifier");
  });

  test("scan should return null for non-@ characters", () => {
    expect(quotedIdentifierPlugin.scan!("foo", 0)).toBeNull();
  });

  test("scan should return null for @ not followed by a quote", () => {
    expect(quotedIdentifierPlugin.scan!("@42", 0)).toBeNull();
    expect(quotedIdentifierPlugin.scan!("@foo", 0)).toBeNull();
  });

  test('scan should emit QuotedIdentifier for @"..."', () => {
    const r = quotedIdentifierPlugin.scan!('@"Age Group"', 0);
    expect(r).not.toBeNull();
    expect(r!.type).toBe("QuotedIdentifier");
    expect(r!.value).toBe('@"Age Group"');
    expect(r!.end).toBe('@"Age Group"'.length);
  });

  test("scan should emit QuotedIdentifier for @'...'", () => {
    const r = quotedIdentifierPlugin.scan!("@'Sub-Category'", 0);
    expect(r).not.toBeNull();
    expect(r!.type).toBe("QuotedIdentifier");
    expect(r!.value).toBe("@'Sub-Category'");
  });

  test("scan should handle @ at a non-zero position", () => {
    const source = 'x + @"Age Group"';
    const pos = source.indexOf("@");
    const r = quotedIdentifierPlugin.scan!(source, pos);
    expect(r!.value).toBe('@"Age Group"');
    expect(r!.end).toBe(source.length);
  });

  test("parsePrefix should return null for non-QuotedIdentifier token", () => {
    const ctx = makeCtx("foo");
    expect(quotedIdentifierPlugin.parsePrefix!(ctx)).toBeNull();
  });

  test("parsePrefix should return Identifier node for QuotedIdentifier token", () => {
    const ctx = makeCtx('@"Age Group"');
    const node = quotedIdentifierPlugin.parsePrefix!(ctx);
    expect(node).not.toBeNull();
    expect(node!.type).toBe("Identifier");
    expect((node as any).name).toBe("Age Group");
  });

  test('Should evaluate @"identifier" from context', () => {
    expect(run('@"Age Group"', { "Age Group": "Youth (<25)" })).toBe("Youth (<25)");
  });

  test("Should evaluate @'identifier' (single quotes)", () => {
    expect(run("@'Sub-Category'", { "Sub-Category": "Road Bikes" })).toBe("Road Bikes");
  });

  test("Should work in binary expressions", () => {
    expect(run('@"Age Group" == "Youth (<25)"', { "Age Group": "Youth (<25)" })).toBe(true);
    expect(run('@"Age Group" == "Youth (<25)"', { "Age Group": "Adults (35-64)" })).toBe(false);
  });

  test("Should work with member access", () => {
    expect(run('@"my obj".name', { "my obj": { name: "Alice" } })).toBe("Alice");
  });

  test("Should work with createResolvedIdentifierPlugin", () => {
    const resolvedEvaluator = new Evaluator([
      quotedIdentifierPlugin,
      ...standardPlugins,
      createResolvedIdentifierPlugin({
        identifiers: ["Age Group"],
        args: ["row"],
      }),
    ]);
    const row = { ageGroup: "Youth (<25)" };
    const context = {
      row,
      "Age Group": (r: typeof row) => r.ageGroup,
    };
    expect(resolvedEvaluator.run('@"Age Group"', context)).toBe("Youth (<25)");
  });

  test("Should work alongside plain identifiers", () => {
    expect(run('@"Age Group" == gender', { "Age Group": "Male", gender: "Male" })).toBe(true);
  });

  test('Unterminated @" should produce ExpressionError token', () => {
    const tokens = tokenizeSafe('@"Age Group', plugins);
    expect(tokens.some((t) => t.type === "ExpressionError")).toBe(true);
  });
});
