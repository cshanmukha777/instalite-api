const prisma = require("../db");

const USER_SELECT = {
  id: true,
  username: true,
  email: true,
  fullname: true,
  bio: true,
  isPrivate: true,
  createdAt: true,
  updatedAt: true,
};

async function createUser(data) {
  return prisma.user.create({
    data: {
      username: data.username,
      email: data.email,
      fullname: data.fullname,
      ...(Object.hasOwn(data, "bio") ? { bio: data.bio } : {}),
    },
    select: USER_SELECT,
  });
}

async function listUsers() {
  return prisma.user.findMany({ select: USER_SELECT, orderBy: { id: "asc" } });
}

async function getUserById(id) {
  return prisma.user.findUnique({ where: { id }, select: USER_SELECT });
}

async function updateUser(id, data) {
  const editable = {};
  for (const field of ["fullname", "bio", "isPrivate"]) {
    if (Object.hasOwn(data, field)) editable[field] = data[field];
  }
  return prisma.user.update({ where: { id }, data: editable, select: USER_SELECT });
}

async function deleteUser(id) {
  return prisma.user.delete({ where: { id } });
}

module.exports = { createUser, listUsers, getUserById, updateUser, deleteUser };
