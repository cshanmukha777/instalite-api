require("dotenv").config();

const express = require("express");
const prisma = require("./db");
const usersRouter = require("./routes/users.routes");
const postsRouter = require("./routes/posts.routes");

const app = express();
app.disable("x-powered-by");
app.use(express.json());

app.get("/health", (_req, res) => res.status(200).json({ status: "OK" }));
app.use("/users", usersRouter);
app.use("/posts", postsRouter);

app.use((req, res) => res.status(404).json({ error: "Route not found" }));

app.use((error, _req, res, _next) => {
  if (error && error.type === "entity.parse.failed") {
    return res.status(400).json({ error: "Invalid JSON body" });
  }
  console.error(error);
  return res.status(500).json({ error: "Internal server error" });
});

const port = Number(process.env.PORT) || 3000;
let server;

if (require.main === module) {
  server = app.listen(port, () => console.log(`Server started on port ${port}`));

  async function shutdown(signal) {
    console.log(`${signal} received; shutting down gracefully`);
    if (server) server.close();
    await prisma.$disconnect();
    process.exit(0);
  }
  process.once("SIGINT", () => shutdown("SIGINT"));
  process.once("SIGTERM", () => shutdown("SIGTERM"));
}

module.exports = app;
