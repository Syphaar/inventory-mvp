import { userModel } from "../models/user.model";
import { hashPassword, comparePassword } from "../utils/password";
import { generateToken } from "../utils/jwt";
import type { AuthResponseDto } from "../dtos/auth.dto";

export const authService = {
  async login(email: string, password: string): Promise<AuthResponseDto> {
    const user = await userModel.findByEmail(email);

    if (!user) {
      throwObject("Invalid email or password", 401);
    }

    const isPasswordValid = await comparePassword(password, user.password);

    if (!isPasswordValid) {
      throwObject("Invalid email or password", 401);
    }

    const accessToken = generateToken({ userId: user.id, email: user.email });

    return {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
      accessToken,
    };
  },

  async register(name: string, email: string, password: string): Promise<AuthResponseDto> {
    const existingUser = await userModel.findByEmail(email);

    if (existingUser) {
      throwObject("A user with this email already exists", 409);
    }

    const hashedPassword = await hashPassword(password);
    const user = await userModel.create({ name, email, password: hashedPassword });
    const accessToken = generateToken({ userId: user.id, email: user.email });

    return {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
      accessToken,
    };
  },

  async getProfile(userId: string) {
    const user = await userModel.findById(userId);

    if (!user) {
      throwObject("User not found", 404);
    }

    return {
      id: user.id,
      name: user.name,
      email: user.email,
    };
  },
};

function throwObject(message: string, statusCode: number): never {
  const error: any = new Error(message);
  error.statusCode = statusCode;
  throw error;
}
