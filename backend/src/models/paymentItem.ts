import { InferSchemaType, model, Schema } from "mongoose";

const paymentItemSchema = new Schema({
    name: { type: String, required: true },
    price: { type: Number, required: true},
    isPaid: { type: Date, required: false, default: null },
    projectId: { type: Schema.Types.ObjectId, ref: "Project", required: true},
}, { timestamps: true });

type PaymentItem = InferSchemaType<typeof paymentItemSchema>;

export default model<PaymentItem>("PaymentItem", paymentItemSchema);