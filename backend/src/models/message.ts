import { InferSchemaType, model, Schema } from "mongoose";

const messageSchema = new Schema({
    message: { type: String, required: true },
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true},
    senderId: { type: Schema.Types.ObjectId, ref: "User", required: true},
    recipientId: { type: Schema.Types.ObjectId, ref: "User", required: true},
    status: { type: String, enum: ["read", "unread"], default: "unread" },
}, { timestamps: true });

type Message = InferSchemaType<typeof messageSchema>;

export default model<Message>("Message", messageSchema);