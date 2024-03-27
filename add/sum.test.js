import { expect, test, describe } from "vitest";
import { sum } from "./sum";

describe("test sum function", () => {
  test("adds 1 + 2 to equal 3", () => {
    expect(sum(1, 2)).toBe(3);
  });

  test(`throw error when 'typeof variable' is 'string'`, () => {
    expect(() => sum("1", 2)).toThrowError(`a or b must be "number"`);
    expect(() => sum(1, "2")).toThrowError(`a or b must be "number"`);
    expect(() => sum("1", "2")).toThrowError(`a or b must be "number"`);
  });
});
