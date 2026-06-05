import type { User } from "../types";
import { generateId } from "../utils/generate-id";

const users: User[] = [];

export const userModel = {
  findAll(): User[] {
    return users;
  },

  findById(id: string): User | undefined {
    return users.find((user) => user.id === id);
  },

  findByEmail(email: string): User | undefined {
    return users.find((user) => user.email === email);
  },

  create(data: { name: string; email: string; password: string }): User {
    const newUser: User = {
      id: generateId(),
      name: data.name,
      email: data.email,
      password: data.password,
      createdAt: new Date().toISOString(),
    };
    users.push(newUser);
    return newUser;
  },

  clear(): void {
    users.length = 0;
  },
};
