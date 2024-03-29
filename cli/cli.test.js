import { expect, test, describe } from "vitest";
import { getRegistry } from "./utils/registry";

describe("test get shadcn component", () => {
  test("get toggle component from shadcn", async () => {
    expect(await getRegistry("toggle")).not.toBeNull();
  });

  test(`throw error when request component that doesn't exist`, async () => {
    expect(await getRegistry("toggl")).toBeNull();
  });
});
