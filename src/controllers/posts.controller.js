const postsService = require("../services/posts.service");
const { parseId, isPrismaError } = require("../utils/http");

async function create(req, res, next) {
  const { imageUrl } = req.body ?? {};
  if (typeof imageUrl !== "string" || imageUrl.trim() === "") {
    return res.status(400).json({ error: "imageUrl is required" });
  }
  try {
    return res.status(201).json(await postsService.createPost(req.body));
  } catch (error) {
    return next(error);
  }
}

async function list(_req, res, next) {
  try {
    return res.status(200).json(await postsService.listPosts());
  } catch (error) {
    return next(error);
  }
}

async function getOne(req, res, next) {
  const id = parseId(req.params.id);
  if (id === null) return res.status(404).json({ error: "Post not found" });
  try {
    const post = await postsService.getPostById(id);
    return post
      ? res.status(200).json(post)
      : res.status(404).json({ error: "Post not found" });
  } catch (error) {
    return next(error);
  }
}

async function update(req, res, next) {
  const id = parseId(req.params.id);
  if (id === null) return res.status(404).json({ error: "Post not found" });
  try {
    return res.status(200).json(await postsService.updatePost(id, req.body ?? {}));
  } catch (error) {
    if (isPrismaError(error, "P2025")) return res.status(404).json({ error: "Post not found" });
    return next(error);
  }
}

async function remove(req, res, next) {
  const id = parseId(req.params.id);
  if (id === null) return res.status(404).json({ error: "Post not found" });
  try {
    await postsService.deletePost(id);
    return res.status(204).end();
  } catch (error) {
    if (isPrismaError(error, "P2025")) return res.status(404).json({ error: "Post not found" });
    return next(error);
  }
}

module.exports = { create, list, getOne, update, remove };
