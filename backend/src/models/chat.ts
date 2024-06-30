import { InferSchemaType, model, MongooseError, Schema } from "mongoose";
import MessageModel from "./message"; 

type DeleteError = MongooseError & { code?: number };

type CustomCallback<T> = (error?: DeleteError | null, result?: T) => void;

const chatSchema = new Schema({
    messages: { type: [Schema.Types.ObjectId], ref: "Message", required: true },
}, { timestamps: true });

type Chat = InferSchemaType<typeof chatSchema>;

chatSchema.pre('save', function (this: Chat, next) {
    if (!this.messages) {
        this.messages = [];
    }
    next();
});

chatSchema.pre('remove', async function (this: Chat, next: CustomCallback<Chat>) {
    try {
        await MessageModel.deleteMany({ _id: { $in: this.messages } });
    } catch (error) {
        next(error as DeleteError);
    }
});

export default model<Chat>("Chat", chatSchema);