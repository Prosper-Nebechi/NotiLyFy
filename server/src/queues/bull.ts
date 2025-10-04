import Queue from "bull";

const redisConfig = {
    host: process.env.REDIS_HOST || "127.0.0.1",
    port: Number(process.env.REDIS_PORT) || 6379,
};

export const smsQueue = new Queue("smsQueue", { redis: redisConfig });
export const emailQueue = new Queue("emailQueue", { redis: redisConfig });
export const inappQueue = new Queue("inappQueue", { redis: redisConfig });