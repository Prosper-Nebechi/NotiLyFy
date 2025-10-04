import Bull, { Queue } from "bull";
import { REDIS_URL } from "../config"

export const emailQueue: Queue = new Bull("email-queue", REDIS_URL);
export const smsQueue: Queue = new Bull("sms-queue", REDIS_URL);
export const inappQueue: Queue = new Bull("inapp-queue", REDIS_URL);

export function getQueueForChannel(channel: "email" | "sms" | "in-app" | "inapp") {
    if (channel === "sms") return smsQueue;
    if (channel === "inapp" || channel === "in-app") return inappQueue;
    return emailQueue; 
}