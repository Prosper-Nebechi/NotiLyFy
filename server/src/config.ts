import dotenv from "dotenv";
import path from "path";


if (process.env.NODE_ENV === "development" && process.env.SKIP_ENV_LOAD !== "1") {
    const envPath = path.resolve(process.cwd(), "env");
    dotenv.config({ path: envPath });
}

function requireEnv(name: string): string {
    const v = process.env[name];
    if (!v) {
        throw new Error(`Missing required environment variable: ${name}`);
    }
    return v;
}

export const NODE_ENV = process.env.NODE_ENV || "development";
export const PORT = process.env.PORT ? Number(process.env.PORT) : 4000;

export const JWT_SECRET = process.env.JWT_SECRET || "";
export const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || "";

export const MONGO_URI = process.env.MONGO_URI || "";


export const REDIS_HOST = process.env.REDIS_HOST || "127.0.0.1";
export const REDIS_PORT = process.env.REDIS_PORT ? Number(process.env.REDIS_PORT): 6379;
export const REDIS_URL = process.env.REDIS_URL || `redis://${REDIS_URL}:${REDIS_URL}`;


export const EMAIL_USER = process.env.EMAIL_USER || "";
export const EMAIL_PASS = process.env.EMAIL_PASS || "";
export const EMAIL_FROM = process.env.EMAIL_FROM || "no-reply@example.com";

export const TWILIO_ACCOUNT_SID = process.env.TWILIO_ACCOUNT_SID || "";
export const TWILIO_AUTH_TOKEN = process.env.TWILIO_AUTH_TOKEN || "";
export const TWILIO_FROM = process.env.TWILIO_FROM || "";

export const LOG_LEVEL = process.env.LOG_LEVEL || "info";

export function validateEnv() {
    const required = [
        "JWT_SECRET",
        "MONGO_URI",
    ];

    required.forEach((k) => {
        if (!process.env[k]) {
            throw new Error(`Environment variable ${k} is required but not set.`);
        }
    });

    if ((TWILIO_ACCOUNT_SID && !TWILIO_AUTH_TOKEN) || (!TWILIO_ACCOUNT_SID && TWILIO_AUTH_TOKEN)) {
        console.warn("TWILIO_ACCOUNT_SID and TWILIO_AUTH_TOKEN should both be set, otherwise SMS will fail.");
    }
    if((EMAIL_USER && !EMAIL_PASS) || (!EMAIL_USER && EMAIL_PASS)) {
        console.warn("EMAIL_USER and EMAIL_PASS should both be set, otherwise SMTP will fail.")
    }
}