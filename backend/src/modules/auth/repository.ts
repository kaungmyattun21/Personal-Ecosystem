import { prisma } from "../../shared/db.js";

export async function findByEmail(email: string) {
  return prisma.user.findUnique({
    where: { email },
  });
}

export async function findById(id: string) {
  return prisma.user.findUnique({
    where: { id },
  });
}

export async function createUser(data: any) {
  return prisma.user.create({
    data,
  });
}

export async function updateUser(id: string, data: any) {
  return prisma.user.update({
    where: { id },
    data,
  });
}
