import { Request, Response, NextFunction, response } from "express";
import { request } from "http";
import jwt from "jsonwebtoken";
import SystemModel from "../db/models/systems";


export interface JwtPayload {
    id: string;
    role: "user" | "admin" | "developer" | "superadmin";
    iat?: number;
    exp?: number;
}


export async function requireAuth(req: Request, res: Response, next: NextFunction) {
    const auth = req.headers.authorization;
    if (!auth || !auth.startsWith("Bearer ")) {
        return res.status(401).json({ message: "No token provided"});
    }
    //verifies token and attaches decoded payload to request else returns 401
    const token = auth.split(" ")[1];
    try {
        const decoded =jwt.verify(token, process.env.JWT_SECRET as string) as JwtPayload;
        (req as any).user = decoded;
        return next();
    }catch (err) {
        return res.status(401).json({ message: "Invalid token" });
    }
}

// This permits only certain roles else returns 403.
export function requireRole(allowed: JwtPayload["role"][]) {
    return (req: Request, res: Response, next: NextFunction) => {
        const user = (req as any).user as JwtPayload | undefined;
        if (!user) return res.status(401).json({ message: "Not authenticated" });
        if (!allowed.includes(user.role)) return res.status(403).json({ message: "Forbidden"});
        return next();
    };
}
//Checks if system is in maintenance, if yes blocks everyone with 503, except superadmin
export async function maintenanceGuard(req: Request, res: Response, next: NextFunction) {
    try {
        const doc = await SystemModel.findOne().sort({ updatedAt: -1}).lean();
        if (doc && doc.maintenance) {
            const user = (req as any).user as JwtPayload | undefined;
            if (user && user.role === "superadmin") {
                return next();
            }
            return res.status(503).json({ message: doc.message || "Service unavailable (under maintenance"});
        }
        return next();
    } catch (err) {
    console.error("maintenanceGuard:", err);
    return next();
    }
}
