import { InferSchemaType, model, Schema } from "mongoose";

const reservationSchema = new Schema({
    title: { type: String, required: true },
    dateFrom: { type: Date, required: true },
    dateTo: { type: Date, required: true },
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true},
}, { timestamps: true });

type ReservationItem = InferSchemaType<typeof reservationSchema>;

export default model<ReservationItem>("Reservation", reservationSchema);