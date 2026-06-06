import dotenv from "dotenv";
import { SignOptions } from "jsonwebtoken";

dotenv.config();

export const config = {
  port: parseInt(process.env.PORT || "3001", 10),
  nodeEnv: process.env.NODE_ENV || "development",
  jwtSecret: process.env.JWT_SECRET || "fallback-secret-do-not-use-in-production",
  // jwtExpiresIn: process.env.JWT_EXPIRES_IN || "7d",
  jwtExpiresIn: (process.env.JWT_EXPIRES_IN || "7d") as SignOptions["expiresIn"],
  corsOrigin: process.env.CORS_ORIGIN || "http://localhost:5173",
};
