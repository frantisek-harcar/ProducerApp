import { InferSchemaType, model, Schema } from "mongoose";

const fileSchema = new Schema({
    originalName: { type: String, required: true },
    price: { type: Number, default: 0 },
    isPaid: { type: Date, required: false, default: null },
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    googleDriveId: {type: String, required: true},
    size: {type: Number, required: true, default: 0},
    downloadLink: {type: String, required: true},
    tags: { type: [Schema.Types.ObjectId], ref: "Tag"},
}, { timestamps: true });

type File = InferSchemaType<typeof fileSchema>;

fileSchema.pre('save', function (this: File, next) {
    if (!this.tags) {
        this.tags = [];
    }
    next();
});

fileSchema.pre('save', function (this: File, next) {
    if (!this.tags) {
        this.tags = [];
    }
    next();
});

export default model<File>("File", fileSchema);