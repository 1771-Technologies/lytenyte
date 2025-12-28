import { describe, expect, test } from "vitest";
import { evaluateStringFilter as ev } from "../evaluate-string-filter.js";
import type { FilterStringSettings } from "../get-string-filter-settings.js";
import type { FilterString } from "../../+types.js";

describe("evaluateStringFilter", () => {
  const accented = "résumé";
  const plain = "resume";
  const uppercase = "RÉSUMÉ";

  const opts: FilterStringSettings = {
    caseInsensitive: false,
    ignorePunctuation: false,
    includeNulls: false,
    trimWhitespace: false,
    locale: "en-US",
    collator: null,
    regex: null,
  };

  test("equals", () => {
    const f: FilterString = {
      kind: "string",
      operator: "equals",
      value: "test",
      options: {},
    };

    expect(ev(f, "test", opts)).toEqual(true);
    expect(ev(f, "test1", opts)).toEqual(false);
    expect(ev(f, "Test", { ...opts, caseInsensitive: true })).toEqual(true);
    expect(ev(f, "te.s!t", { ...opts, ignorePunctuation: true })).toEqual(true);
    expect(ev(f, "  test  ", { ...opts, trimWhitespace: true })).toEqual(true);
    expect(ev(f, null, { ...opts, includeNulls: false })).toEqual(false);
    expect(ev(f, null, { ...opts, includeNulls: true })).toEqual(true);
    expect(ev({ ...f, value: null }, null, { ...opts, includeNulls: true })).toEqual(true);
    expect(ev({ ...f, value: null }, "x", { ...opts, includeNulls: true })).toEqual(false);
    expect(ev({ ...f, value: null }, "x", { ...opts, includeNulls: false })).toEqual(false);

    let collator = new Intl.Collator("en", { sensitivity: "base" });
    expect(ev({ ...f, value: plain }, accented, { ...opts, collator })).toEqual(true);
    collator = new Intl.Collator("en", { sensitivity: "accent" });
    expect(ev({ ...f, value: plain }, accented, { ...opts, collator })).toEqual(false);
    collator = new Intl.Collator("en", { sensitivity: "case" });
    expect(ev({ ...f, value: uppercase }, accented, { ...opts, collator, caseInsensitive: true })).toEqual(
      true,
    );
    collator = new Intl.Collator("en", { sensitivity: "base" });
    expect(ev({ ...f, value: uppercase }, accented, { ...opts, collator })).toEqual(true);
    collator = new Intl.Collator("en", { sensitivity: "variant" });
    expect(ev({ ...f, value: uppercase }, accented, { ...opts, collator, caseInsensitive: true })).toEqual(
      true,
    );
  });

  test("not_equals", () => {
    const f: FilterString = {
      kind: "string",
      operator: "not_equals",
      value: "test",
      options: {},
    };

    expect(ev(f, "test", opts)).toEqual(false);
    expect(ev(f, "test1", opts)).toEqual(true);
    expect(ev(f, "Test", { ...opts, caseInsensitive: true })).toEqual(false);
    expect(ev(f, "te.s!t", { ...opts, ignorePunctuation: true })).toEqual(false);
    expect(ev(f, "  test  ", { ...opts, trimWhitespace: true })).toEqual(false);

    expect(ev(f, null, { ...opts, includeNulls: false })).toEqual(false);
    expect(ev(f, null, { ...opts, includeNulls: true })).toEqual(true);
    expect(ev({ ...f, value: null }, null, { ...opts, includeNulls: true })).toEqual(false);
    expect(ev({ ...f, value: null }, "x", { ...opts, includeNulls: true })).toEqual(true);
    expect(ev({ ...f, value: null }, "x", { ...opts, includeNulls: false })).toEqual(true);

    let collator = new Intl.Collator("en", { sensitivity: "base" });
    expect(ev({ ...f, value: plain }, accented, { ...opts, collator })).toEqual(false);
    collator = new Intl.Collator("en", { sensitivity: "accent" });
    expect(ev({ ...f, value: plain }, accented, { ...opts, collator })).toEqual(true);
    collator = new Intl.Collator("en", { sensitivity: "case" });
    expect(ev({ ...f, value: uppercase }, accented, { ...opts, collator, caseInsensitive: true })).toEqual(
      false,
    );
    collator = new Intl.Collator("en", { sensitivity: "base" });
    expect(ev({ ...f, value: uppercase }, accented, { ...opts, collator })).toEqual(false);
    collator = new Intl.Collator("en", { sensitivity: "variant" });
    expect(ev({ ...f, value: uppercase }, accented, { ...opts, collator, caseInsensitive: true })).toEqual(
      false,
    );
  });

  test("length", () => {
    const f: FilterString = {
      kind: "string",
      operator: "length",
      value: "test",
      options: {},
    };

    expect(ev({ ...f, value: null }, "test", opts)).toEqual(false);
    expect(ev(f, 4, opts)).toEqual(true);
    expect(ev({ ...f, value: 4 }, 4, opts)).toEqual(true);
    expect(ev({ ...f, value: 5 }, 4, opts)).toEqual(false);
    expect(ev(f, "life", opts)).toEqual(true);
    expect(ev(f, "lifeA", opts)).toEqual(false);
    expect(ev(f, "lifeA", { ...opts, caseInsensitive: true })).toEqual(false);
    expect(ev(f, "l.if.e", { ...opts, ignorePunctuation: true })).toEqual(true);
    expect(ev(f, "   l.if.e!", { ...opts, ignorePunctuation: true, trimWhitespace: true })).toEqual(true);
    expect(ev(f, null, { ...opts, includeNulls: true })).toEqual(true);
    expect(ev(f, null, { ...opts, includeNulls: false })).toEqual(false);
  });

  test("length_greater_than", () => {
    const f: FilterString = {
      kind: "string",
      operator: "length_greater_than",
      value: "test",
      options: {},
    };

    expect(ev(f, 4, opts)).toEqual(false);
    expect(ev(f, 3, opts)).toEqual(false);
    expect(ev(f, 5, opts)).toEqual(true);
    expect(ev(f, "life", opts)).toEqual(false);
    expect(ev(f, "lifeA", opts)).toEqual(true);
    expect(ev(f, "l.if.e", { ...opts, ignorePunctuation: true })).toEqual(false);
    expect(ev(f, "la.if.e", { ...opts, ignorePunctuation: true })).toEqual(true);
    expect(ev(f, "   l.if.e!", { ...opts, ignorePunctuation: true, trimWhitespace: true })).toEqual(false);
    expect(ev(f, "   la.if.e!", { ...opts, ignorePunctuation: true, trimWhitespace: true })).toEqual(true);
  });

  test("length_greater_than_or_equals", () => {
    const f: FilterString = {
      kind: "string",
      operator: "length_greater_than_or_equals",
      value: "test",
      options: {},
    };

    expect(ev(f, 4, opts)).toEqual(true);
    expect(ev(f, 3, opts)).toEqual(false);
    expect(ev(f, 5, opts)).toEqual(true);
    expect(ev(f, "life", opts)).toEqual(true);
    expect(ev(f, "lfe", opts)).toEqual(false);
    expect(ev(f, "lifeA", opts)).toEqual(true);
    expect(ev(f, "l.if.e", { ...opts, ignorePunctuation: true })).toEqual(true);
    expect(ev(f, "la.if.e", { ...opts, ignorePunctuation: true })).toEqual(true);
  });

  test("length_less_than", () => {
    const f: FilterString = {
      kind: "string",
      operator: "length_less_than",
      value: "test",
      options: {},
    };

    expect(ev(f, 4, opts)).toEqual(false);
    expect(ev(f, 3, opts)).toEqual(true);
    expect(ev(f, 5, opts)).toEqual(false);
    expect(ev(f, "life", opts)).toEqual(false);
    expect(ev(f, "lfe", opts)).toEqual(true);
    expect(ev(f, "lifeA", opts)).toEqual(false);
    expect(ev(f, "l.if.e", { ...opts, ignorePunctuation: true })).toEqual(false);
    expect(ev(f, "l.f.e", { ...opts, ignorePunctuation: true })).toEqual(true);
  });

  test("length_less_than_or_equals", () => {
    const f: FilterString = {
      kind: "string",
      operator: "length_less_than_or_equals",
      value: "test",
      options: {},
    };

    expect(ev(f, 4, opts)).toEqual(true);
    expect(ev(f, 3, opts)).toEqual(true);
    expect(ev(f, 5, opts)).toEqual(false);
    expect(ev(f, "life", opts)).toEqual(true);
    expect(ev(f, "lfe", opts)).toEqual(true);
    expect(ev(f, "lifeA", opts)).toEqual(false);
    expect(ev(f, "l.if.e", { ...opts, ignorePunctuation: true })).toEqual(true);
    expect(ev(f, "l.f.e", { ...opts, ignorePunctuation: true })).toEqual(true);
  });

  test("not_length", () => {
    const f: FilterString = {
      kind: "string",
      operator: "not_length",
      value: "test",
      options: {},
    };

    expect(ev(f, 4, opts)).toEqual(false);
    expect(ev(f, 3, opts)).toEqual(true);
    expect(ev(f, 5, opts)).toEqual(true);
    expect(ev(f, "life", opts)).toEqual(false);
    expect(ev(f, "lfe", opts)).toEqual(true);
    expect(ev(f, "lifeA", opts)).toEqual(true);
    expect(ev(f, "l.if.e", { ...opts, ignorePunctuation: true })).toEqual(false);
    expect(ev(f, "l.f.e", { ...opts, ignorePunctuation: true })).toEqual(true);
  });

  test("begins_with", () => {
    const f: FilterString = {
      kind: "string",
      operator: "begins_with",
      value: "test",
      options: {},
    };

    expect(ev(f, "tester", opts)).toEqual(true);
    expect(ev(f, "test", opts)).toEqual(true);
    expect(ev(f, "fe", opts)).toEqual(false);
    expect(ev(f, "Tester", { ...opts, caseInsensitive: true })).toEqual(true);
    expect(ev(f, "Tester", { ...opts, caseInsensitive: false })).toEqual(false);
    expect(ev(f, "te!s.ter", { ...opts, ignorePunctuation: true })).toEqual(true);
    expect(ev(f, "te.ster", { ...opts, ignorePunctuation: false })).toEqual(false);
    expect(ev(f, "  tester", { ...opts, trimWhitespace: true })).toEqual(true);
    expect(ev(f, "  tester", { ...opts, trimWhitespace: false })).toEqual(false);
  });

  test("not_begins_with", () => {
    const f: FilterString = {
      kind: "string",
      operator: "not_begins_with",
      value: "test",
      options: {},
    };

    expect(ev({ ...f, value: 23 }, 23, opts)).toEqual(false);
    expect(ev(f, "tester", opts)).toEqual(false);
    expect(ev(f, "test", opts)).toEqual(false);
    expect(ev(f, "fe", opts)).toEqual(true);
    expect(ev(f, "Tester", { ...opts, caseInsensitive: true })).toEqual(false);
    expect(ev(f, "Tester", { ...opts, caseInsensitive: false })).toEqual(true);
    expect(ev(f, "te!s.ter", { ...opts, ignorePunctuation: true })).toEqual(false);
    expect(ev(f, "te.ster", { ...opts, ignorePunctuation: false })).toEqual(true);
    expect(ev(f, "  tester", { ...opts, trimWhitespace: true })).toEqual(false);
    expect(ev(f, "  tester", { ...opts, trimWhitespace: false })).toEqual(true);
  });

  test("contains", () => {
    const f: FilterString = {
      kind: "string",
      operator: "contains",
      value: "test",
      options: {},
    };

    expect(ev(f, "tester", opts)).toEqual(true);
    expect(ev(f, "fe", opts)).toEqual(false);
    expect(ev(f, "Tester", { ...opts, caseInsensitive: true })).toEqual(true);
    expect(ev(f, "Tester", { ...opts, caseInsensitive: false })).toEqual(false);
    expect(ev(f, "te!s.ter", { ...opts, ignorePunctuation: true })).toEqual(true);
    expect(ev(f, "te.ster", { ...opts, ignorePunctuation: false })).toEqual(false);
    expect(ev(f, "  tester", { ...opts, trimWhitespace: true })).toEqual(true);
    expect(ev(f, "  tester", { ...opts, trimWhitespace: false })).toEqual(true);
  });

  test("not_contains", () => {
    const f: FilterString = {
      kind: "string",
      operator: "not_contains",
      value: "test",
      options: {},
    };

    expect(ev(f, "tester", opts)).toEqual(false);
    expect(ev(f, "fe", opts)).toEqual(true);
    expect(ev(f, "Tester", { ...opts, caseInsensitive: true })).toEqual(false);
    expect(ev(f, "Tester", { ...opts, caseInsensitive: false })).toEqual(true);
    expect(ev(f, "te!s.ter", { ...opts, ignorePunctuation: true })).toEqual(false);
    expect(ev(f, "te.ster", { ...opts, ignorePunctuation: false })).toEqual(true);
    expect(ev(f, "  tester", { ...opts, trimWhitespace: true })).toEqual(false);
    expect(ev(f, "  tester", { ...opts, trimWhitespace: false })).toEqual(false);
  });

  test("ends_with", () => {
    const f: FilterString = {
      kind: "string",
      operator: "ends_with",
      value: "test",
      options: {},
    };

    expect(ev(f, "right_test", opts)).toEqual(true);
    expect(ev(f, "fire", opts)).toEqual(false);
    expect(ev(f, "runTest", { ...opts, caseInsensitive: true })).toEqual(true);
    expect(ev(f, "runTest", { ...opts, caseInsensitive: false })).toEqual(false);
    expect(ev(f, "te!ste.st", { ...opts, ignorePunctuation: true })).toEqual(true);
    expect(ev(f, "te!ste.st", { ...opts, ignorePunctuation: false })).toEqual(false);
    expect(ev(f, "  run_test", { ...opts, trimWhitespace: true })).toEqual(true);
    expect(ev(f, "  run_test ", { ...opts, trimWhitespace: false })).toEqual(false);
  });

  test("not_ends_with", () => {
    const f: FilterString = {
      kind: "string",
      operator: "not_ends_with",
      value: "test",
      options: {},
    };

    expect(ev(f, "right_test", opts)).toEqual(false);
    expect(ev(f, "fire", opts)).toEqual(true);
    expect(ev(f, "runTest", { ...opts, caseInsensitive: true })).toEqual(false);
    expect(ev(f, "runTest", { ...opts, caseInsensitive: false })).toEqual(true);
    expect(ev(f, "te!ste.st", { ...opts, ignorePunctuation: true })).toEqual(false);
    expect(ev(f, "te!ste.st", { ...opts, ignorePunctuation: false })).toEqual(true);
    expect(ev(f, "  run_test", { ...opts, trimWhitespace: true })).toEqual(false);
    expect(ev(f, "  run_test ", { ...opts, trimWhitespace: false })).toEqual(true);
  });

  test("greater_than", () => {
    const f: FilterString = {
      kind: "string",
      operator: "greater_than",
      value: "beta",
      options: {},
    };

    expect(ev(f, "alpha", opts)).toEqual(false);
    expect(ev(f, "sigma", opts)).toEqual(true);
    expect(ev(f, "beta", opts)).toEqual(false);
    expect(ev(f, "Sigma", { ...opts, caseInsensitive: true })).toEqual(true);
    expect(ev(f, ".sigma", { ...opts, ignorePunctuation: true })).toEqual(true);
    expect(ev(f, "   sigma", { ...opts, trimWhitespace: true })).toEqual(true);

    let collator = new Intl.Collator("en", { sensitivity: "base" });
    expect(ev({ ...f, value: plain }, accented, { ...opts, collator })).toEqual(false);
    collator = new Intl.Collator("en", { sensitivity: "accent" });
    expect(ev({ ...f, value: plain }, accented, { ...opts, collator })).toEqual(true);
    collator = new Intl.Collator("en", { sensitivity: "case" });
    expect(ev({ ...f, value: uppercase }, accented, { ...opts, collator, caseInsensitive: true })).toEqual(
      false,
    );
    collator = new Intl.Collator("en", { sensitivity: "base" });
    expect(ev({ ...f, value: uppercase }, accented, { ...opts, collator })).toEqual(false);
    collator = new Intl.Collator("en", { sensitivity: "variant" });
    expect(ev({ ...f, value: uppercase }, accented, { ...opts, collator, caseInsensitive: true })).toEqual(
      false,
    );
  });

  test("greater_than_or_equals", () => {
    const f: FilterString = {
      kind: "string",
      operator: "greater_than_or_equals",
      value: "beta",
      options: {},
    };

    expect(ev(f, "alpha", opts)).toEqual(false);
    expect(ev(f, "sigma", opts)).toEqual(true);
    expect(ev(f, "beta", opts)).toEqual(true);
    expect(ev(f, "Sigma", { ...opts, caseInsensitive: true })).toEqual(true);
    expect(ev(f, ".sigma", { ...opts, ignorePunctuation: true })).toEqual(true);
    expect(ev(f, "   sigma", { ...opts, trimWhitespace: true })).toEqual(true);

    let collator = new Intl.Collator("en", { sensitivity: "base" });
    expect(ev({ ...f, value: plain }, accented, { ...opts, collator })).toEqual(true);
    collator = new Intl.Collator("en", { sensitivity: "accent" });
    expect(ev({ ...f, value: plain }, accented, { ...opts, collator })).toEqual(true);
    collator = new Intl.Collator("en", { sensitivity: "case" });
    expect(ev({ ...f, value: uppercase }, accented, { ...opts, collator, caseInsensitive: true })).toEqual(
      true,
    );
    collator = new Intl.Collator("en", { sensitivity: "base" });
    expect(ev({ ...f, value: uppercase }, accented, { ...opts, collator })).toEqual(true);
    collator = new Intl.Collator("en", { sensitivity: "variant" });
    expect(ev({ ...f, value: uppercase }, accented, { ...opts, collator, caseInsensitive: true })).toEqual(
      true,
    );
  });

  test("less_than", () => {
    const f: FilterString = {
      kind: "string",
      operator: "less_than",
      value: "beta",
      options: {},
    };

    expect(ev(f, "alpha", opts)).toEqual(true);
    expect(ev(f, "sigma", opts)).toEqual(false);
    expect(ev(f, "beta", opts)).toEqual(false);
    expect(ev(f, "Sigma", { ...opts, caseInsensitive: true })).toEqual(false);
    expect(ev(f, ".sigma", { ...opts, ignorePunctuation: true })).toEqual(false);
    expect(ev(f, "   sigma", { ...opts, trimWhitespace: true })).toEqual(false);

    let collator = new Intl.Collator("en", { sensitivity: "base" });
    expect(ev({ ...f, value: plain }, accented, { ...opts, collator })).toEqual(false);
    collator = new Intl.Collator("en", { sensitivity: "accent" });
    expect(ev({ ...f, value: plain }, accented, { ...opts, collator })).toEqual(false);
    collator = new Intl.Collator("en", { sensitivity: "case" });
    expect(ev({ ...f, value: uppercase }, accented, { ...opts, collator, caseInsensitive: true })).toEqual(
      false,
    );
    collator = new Intl.Collator("en", { sensitivity: "base" });
    expect(ev({ ...f, value: uppercase }, accented, { ...opts, collator })).toEqual(false);
    collator = new Intl.Collator("en", { sensitivity: "variant" });
    expect(ev({ ...f, value: uppercase }, accented, { ...opts, collator, caseInsensitive: true })).toEqual(
      false,
    );
  });

  test("less_than_or_equals", () => {
    const f: FilterString = {
      kind: "string",
      operator: "less_than_or_equals",
      value: "beta",
      options: {},
    };

    expect(ev(f, "alpha", opts)).toEqual(true);
    expect(ev(f, "sigma", opts)).toEqual(false);
    expect(ev(f, "beta", opts)).toEqual(true);
    expect(ev(f, "Sigma", { ...opts, caseInsensitive: true })).toEqual(false);
    expect(ev(f, ".sigma", { ...opts, ignorePunctuation: true })).toEqual(false);
    expect(ev(f, "   sigma", { ...opts, trimWhitespace: true })).toEqual(false);

    let collator = new Intl.Collator("en", { sensitivity: "base" });
    expect(ev({ ...f, value: plain }, accented, { ...opts, collator })).toEqual(true);
    collator = new Intl.Collator("en", { sensitivity: "accent" });
    expect(ev({ ...f, value: plain }, accented, { ...opts, collator })).toEqual(false);
    collator = new Intl.Collator("en", { sensitivity: "case" });
    expect(ev({ ...f, value: uppercase }, accented, { ...opts, collator, caseInsensitive: true })).toEqual(
      true,
    );
    collator = new Intl.Collator("en", { sensitivity: "base" });
    expect(ev({ ...f, value: uppercase }, accented, { ...opts, collator })).toEqual(true);
    collator = new Intl.Collator("en", { sensitivity: "variant" });
    expect(ev({ ...f, value: uppercase }, accented, { ...opts, collator, caseInsensitive: true })).toEqual(
      true,
    );
  });

  test("matches", () => {
    const f: FilterString = {
      kind: "string",
      operator: "matches",
      value: "beta",
      options: {},
    };

    expect(ev(f, "beta", { ...opts, regex: /beta/ })).toEqual(true);
    expect(ev(f, "beta", { ...opts, regex: /run/ })).toEqual(false);
    expect(ev(f, "beta", { ...opts })).toEqual(false);
  });

  test("invalid data handling", () => {
    const f: FilterString = {
      kind: "string",
      operator: "matches",
      value: "beta",
      options: {},
    };

    expect(ev(f, new Date() as unknown as string, opts)).toEqual(false);
    expect(
      ev({ ...f, value: new Date() as unknown as string }, new Date() as unknown as string, opts),
    ).toEqual(false);
  });

  test("unknown", () => {
    const f: FilterString = {
      kind: "string",
      operator: "xx" as any,
      value: "beta",
      options: {},
    };

    expect(ev(f, "beta", { ...opts, regex: /beta/ })).toEqual(false);
  });
});
