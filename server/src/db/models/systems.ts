import mongoose, { Document } from "mongoose";

export interface ISystem extends Document {
    maintenance: boolean;
    message?: string;
    updatedAt?: Date;
}

const systemSchema = new mongoose.Schema<ISystem>(
    {
        maintenance: { type: Boolean, required: true, default: false},
        message: { type: String, default: "Service is under maintenanace"}
    },
    { timestamps: true }
);

const SystemModel = mongoose.model<ISystem>("System", systemSchema);
export default SystemModel;