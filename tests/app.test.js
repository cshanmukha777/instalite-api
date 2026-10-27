const test = require("node:test");
const assert = require("node:assert/strict");
const request = require("supertest");
const app = require("../src/index");

test("GET /health returns the required status and JSON body", async () => {
  const response = await request(app).get("/health");
  assert.equal(response.status, 200);
  assert.match(response.headers["content-type"], /application\/json/);
  assert.deepEqual(response.body, { status: "OK" });
});

test("unknown routes return JSON 404", async () => {
  const response = await request(app).get("/does-not-exist");
  assert.equal(response.status, 404);
  assert.deepEqual(response.body, { error: "Route not found" });
});
