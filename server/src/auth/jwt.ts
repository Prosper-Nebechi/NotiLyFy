// server/src/auth/jwt.ts
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../config";

export interface JwtPayload {
  id: string;
  role?: string;
  iat?: number;
  exp?: number;
}

if (!JWT_SECRET) {
  throw new Error("Missing JWT_SECRET - set in environment variables.");
}

export function signJwt(payload: object, opts?: jwt.SignOptions) {
  return jwt.sign(payload, JWT_SECRET, { ...(opts || { expiresIn: "7d" }) });
}

export function verifyJwt<T = JwtPayload>(token: string): T {
  return jwt.verify(token, JWT_SECRET) as T;
}
