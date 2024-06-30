import { InferSchemaType, model, Schema } from "mongoose";

const userSchema = new Schema({
    name: { type: String },
    password: { type: String, required: true, select: false },
    email: { type: String, required: true, unique: true },
    admin: { type: Boolean, default: false },
}, { timestamps: true });

type User = InferSchemaType<typeof userSchema>;

export default model<User>("User", userSchema);