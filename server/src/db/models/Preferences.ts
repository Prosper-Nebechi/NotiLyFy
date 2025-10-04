import mongoose, { Document, mongo } from "mongoose";

//stores user notification preferences
export interface IPreferences extends Document {
    userId: String;
    emailNotifications: boolean;
    pushNotifications: boolean;
}

const preferenceSchema = new mongoose.Schema<IPreferences>(
    {
        userId: { type: String, required: true },
        emailNotifications: { type: Boolean, default: true },
        pushNotifications: { type: Boolean, default: true }
    },
    { timestamps: true }
);

export default mongoose.model<IPreferences>("Preferences", preferenceSchema);