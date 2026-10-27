const prisma = require("../db");

const POST_SELECT = {
  id: true,
  imageUrl: true,
  caption: true,
  location: true,
  createdAt: true,
  updatedAt: true,
};

async function createPost(data) {
  return prisma.post.create({
    data: {
      imageUrl: data.imageUrl,
      ...(Object.hasOwn(data, "caption") ? { caption: data.caption } : {}),
      ...(Object.hasOwn(data, "location") ? { location: data.location } : {}),
    },
    select: POST_SELECT,
  });
}

async function listPosts() {
  return prisma.post.findMany({ select: POST_SELECT, orderBy: { id: "asc" } });
}

async function getPostById(id) {
  return prisma.post.findUnique({ where: { id }, select: POST_SELECT });
}

async function updatePost(id, data) {
  const editable = {};
  for (const field of ["caption", "location"]) {
    if (Object.hasOwn(data, field)) editable[field] = data[field];
  }
  return prisma.post.update({ where: { id }, data: editable, select: POST_SELECT });
}

async function deletePost(id) {
  return prisma.post.delete({ where: { id } });
}

module.exports = { createPost, listPosts, getPostById, updatePost, deletePost };
