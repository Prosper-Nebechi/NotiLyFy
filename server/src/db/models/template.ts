import mongoose, { Document } from "mongoose";
//Notification template (reusable contents)
export interface ITemplate extends Document {
    name: String;
    content: String;
}

const templateSchema = new mongoose.Schema<ITemplate>(
    {
        name: { type: String, required: true, unique: true },//template name
        content: { type: String, required: true }//template body (with placeholders)
    },
    { timestamps: true }
);

export default mongoose.model<ITemplate>("Template", templateSchema);