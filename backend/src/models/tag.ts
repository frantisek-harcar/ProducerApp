import { InferSchemaType, model, Schema } from "mongoose";

const tagSchema = new Schema({
    name: { type: String, required: true },
    color: { type: String },
}, { timestamps: true });

type Tag = InferSchemaType<typeof tagSchema>;

export default model<Tag>("Tag", tagSchema);