import { prisma } from "../lib/prisma";
import type { User } from "../types";

export const userModel = {
  async findAll(): Promise<User[]> {
    const users = await prisma.user.findMany();
    return users.map(toUser);
  },

  async findById(id: string): Promise<User | undefined> {
    const user = await prisma.user.findUnique({ where: { id } });
    return user ? toUser(user) : undefined;
  },

  async findByEmail(email: string): Promise<User | undefined> {
    const user = await prisma.user.findUnique({ where: { email } });
    return user ? toUser(user) : undefined;
  },

  async create(data: { name: string; email: string; password: string }): Promise<User> {
    const user = await prisma.user.create({ data });
    return toUser(user);
  },

  async clear(): Promise<void> {
    await prisma.user.deleteMany();
  },
};

function toUser(u: { id: string; name: string; email: string; password: string; createdAt: Date }): User {
  return {
    id: u.id,
    name: u.name,
    email: u.email,
    password: u.password,
    createdAt: u.createdAt.toISOString(),
  };
}
