import { InferSchemaType, model, MongooseError, Schema } from "mongoose";
import ReservationModel from "./reservation"; 
import ChatModel from "./chat"; 

type DeleteError = MongooseError & { code?: number };

type CustomCallback<T> = (error?: DeleteError | null, result?: T) => void;

const projectSchema = new Schema({
    name: { type: String, required: true },
    isDone: { type: Date, required: false, default: null },
    archived: {type: Boolean, default: false},
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    chatId: { type: Schema.Types.ObjectId, ref: "Chat", required: true },
    files: { type: [Schema.Types.ObjectId], ref: "File" },
    tags: { type: [Schema.Types.ObjectId], ref: "Tag" },
    reservations: { type: [Schema.Types.ObjectId], ref: "Reservation" },
}, { timestamps: true });

type Project = InferSchemaType<typeof projectSchema>;

projectSchema.pre('save', function (this: Project, next) {
    if (!this.files) {
        this.files = [];
    }
    next();
});

projectSchema.pre('save', function (this: Project, next) {
    if (!this.tags) {
        this.tags = [];
    }
    next();
});

projectSchema.pre('save', function (this: Project, next) {
    if (!this.reservations) {
        this.reservations = [];
    }
    next();
});

projectSchema.pre('remove', async function (this: Project, next: CustomCallback<Project>) {
    try {
        await ReservationModel.deleteMany({ _id: { $in: this.reservations } });
    } catch (error) {
        next(error as DeleteError);
    }
});

projectSchema.pre('remove', async function (this: Project, next: CustomCallback<Project>) {
    try {
        await ChatModel.deleteOne({ _id: { $in: this.chatId } });
    } catch (error) {
        next(error as DeleteError);
    }
});


export default model<Project>("Project", projectSchema);