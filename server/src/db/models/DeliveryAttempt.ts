import mongoose, { Document } from "mongoose";

export interface IDeliveryAttempt extends Document {
    notificationId: string;
    channel: "email" | "sms" | "in-app";
    status: "success" | "failed";
    attemptedAt: Date;
    error?: string;
    info?: any;
    jobId?: string;
}

// this schema tracks every attempt to deliver a notification 
const deliveryAttemptSchema = new mongoose.Schema<IDeliveryAttempt>(
    {
        notificationId: { type: String, required: true}, //links to notification being delivered
        channel: { type: String, required: true },
        status: { type: String, enum: ["success", "failed"], required: true}, // delivery result
        attemptedAt: { type: Date, default: Date.now }, // when attempt happened
        error: { type: String },
        info: { type: Object },
        jobId: { type: String },
    },
    { timestamps: true }
);
// registers the schema with mongoose under deliveryAttempt collection
export default mongoose.model<IDeliveryAttempt>("DeliveryAttempt", deliveryAttemptSchema);