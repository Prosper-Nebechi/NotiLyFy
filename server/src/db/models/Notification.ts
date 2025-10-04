import mongoose, { Document } from "mongoose";
//Reepresents inapp notification
export interface INotification extends Document {
    eventId: string;
    type: string;
    channel: "email" | "sms" | "in-app";
    recipient: Record<string, any>;
    payload: Record<string, any>;
    attempts: number;
    lastAttemptAt?: Date;
    userId: String;
    title: String;
    body: String;
    read: boolean;
    status: "pending" | "sent" | "failed";
}

const notificationSchema = new mongoose.Schema<INotification>(
    {
        eventId: { type: String, required: true },
        type: { type: String, required: true },
        channel: { type: String, enum: ["email", "sms", "in-app"], required: true },
        recipient: { type: Object, default: {} },
        payload: { type: Object, default: {} },
        status: { type: String, enum: ["pending", "processing", "sent", "failed"], default: "pending" },
        attempts: { type: Number, default: 0 },
        lastAttemptAt: { type: Date },
        userId: { type: String, required: true },//user receiving it
        title: { type: String, required: true },
        body: { type: String, required: true },
        read: { type: Boolean, default: false},// mark if read
    },
    { timestamps: true }
);


export default mongoose.model<INotification>("Notification", notificationSchema);