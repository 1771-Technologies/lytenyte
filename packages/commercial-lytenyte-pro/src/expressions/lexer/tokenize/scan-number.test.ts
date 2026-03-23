import { describe, test, expect } from "vitest";
import { scanNumber } from "./scan-number";

describe("scanNumber", () => {
  test("Should scan a single digit", () => {
    expect(scanNumber("5", 0)).toEqual({ value: "5", end: 1 });
  });

  test("Should scan a multi-digit integer", () => {
    expect(scanNumber("42", 0)).toEqual({ value: "42", end: 2 });
  });

  test("Should scan a decimal number", () => {
    expect(scanNumber("3.14", 0)).toEqual({ value: "3.14", end: 4 });
  });

  test("Should scan a number with leading zero", () => {
    expect(scanNumber("007", 0)).toEqual({ value: "007", end: 3 });
  });

  test("Should stop at non-numeric characters", () => {
    expect(scanNumber("42abc", 0)).toEqual({ value: "42", end: 2 });
  });

  test("Should scan from an offset position", () => {
    expect(scanNumber("  99", 2)).toEqual({ value: "99", end: 4 });
  });

  test("Should scan hex numbers with 0x prefix", () => {
    expect(scanNumber("0xFF", 0)).toEqual({ value: "0xFF", end: 4 });
  });

  test("Should scan hex numbers with 0X prefix", () => {
    expect(scanNumber("0XAB", 0)).toEqual({ value: "0XAB", end: 4 });
  });

  test("Should scan multi-digit hex numbers", () => {
    expect(scanNumber("0x1A2B3C", 0)).toEqual({ value: "0x1A2B3C", end: 8 });
  });

  test("Should scan octal numbers with 0o prefix", () => {
    expect(scanNumber("0o77", 0)).toEqual({ value: "0o77", end: 4 });
  });

  test("Should scan octal numbers with 0O prefix", () => {
    expect(scanNumber("0O77", 0)).toEqual({ value: "0O77", end: 4 });
  });

  test("Should scan binary numbers with 0b prefix", () => {
    expect(scanNumber("0b1010", 0)).toEqual({ value: "0b1010", end: 6 });
  });

  test("Should scan binary numbers with 0B prefix", () => {
    expect(scanNumber("0B1100", 0)).toEqual({ value: "0B1100", end: 6 });
  });

  test("Should scan scientific notation with lowercase e", () => {
    expect(scanNumber("1e5", 0)).toEqual({ value: "1e5", end: 3 });
  });

  test("Should scan scientific notation with uppercase E", () => {
    expect(scanNumber("2E10", 0)).toEqual({ value: "2E10", end: 4 });
  });

  test("Should scan scientific notation with positive exponent", () => {
    expect(scanNumber("2E+10", 0)).toEqual({ value: "2E+10", end: 5 });
  });

  test("Should scan scientific notation with negative exponent", () => {
    expect(scanNumber("1.5e-3", 0)).toEqual({ value: "1.5e-3", end: 6 });
  });

  test("Should scan numbers with underscore separators", () => {
    expect(scanNumber("1_000_000", 0)).toEqual({ value: "1_000_000", end: 9 });
  });

  test("Should scan hex numbers with underscore separators", () => {
    expect(scanNumber("0xFF_FF", 0)).toEqual({ value: "0xFF_FF", end: 7 });
  });

  test("Should not treat a trailing dot as decimal when not followed by a digit", () => {
    expect(scanNumber("42.abc", 0)).toEqual({ value: "42", end: 2 });
  });

  test("Should not treat a trailing dot as decimal at end of string", () => {
    expect(scanNumber("42.", 0)).toEqual({ value: "42", end: 2 });
  });

  test("Should scan decimal with scientific notation", () => {
    expect(scanNumber("1.5e10", 0)).toEqual({ value: "1.5e10", end: 6 });
  });
});
