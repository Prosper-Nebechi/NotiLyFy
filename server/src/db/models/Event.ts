import mongoose, { Document } from "mongoose";

//Represents a system event (like "user_signed_up")
export interface IEvent extends Document {
    type: String;
    data: Record<string, any>;
    createdAt: Date;
}
//Stores arbitrary metadata for logs/auditing
const eventSchema = new mongoose.Schema<IEvent>(
    {
        type: { type: String, required: true },// event type (login, signup, etc.)
        data: { type: Object, required: true}//extra payload
    },
    { timestamps: true}
);

export default mongoose.model<IEvent>("Event", eventSchema);