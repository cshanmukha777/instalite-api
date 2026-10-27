const test = require("node:test");
const assert = require("node:assert/strict");
const { parseId, isPrismaError } = require("../src/utils/http");

test("parseId accepts positive integer path values", () => {
  assert.equal(parseId("1"), 1);
  assert.equal(parseId("42"), 42);
});

test("parseId rejects invalid, unsafe, and non-positive values", () => {
  for (const value of ["0", "-1", "1.2", "abc", "", "9007199254740992", undefined]) {
    assert.equal(parseId(value), null);
  }
});

test("isPrismaError checks known Prisma error codes safely", () => {
  assert.equal(isPrismaError({ code: "P2002" }, "P2002"), true);
  assert.equal(isPrismaError({ code: "P2025" }, "P2002"), false);
  assert.equal(isPrismaError(null, "P2002"), false);
});
