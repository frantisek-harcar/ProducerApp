import express from "express";
import * as ReservationsController from "../controllers/reservations";

const router = express.Router();

router.post("/", ReservationsController.createReservation);

router.get("/", ReservationsController.getReservations);

router.get("/:reservationId", ReservationsController.getReservation);

router.patch("/:reservationId", ReservationsController.updateReservation);

router.delete("/:reservationId", ReservationsController.deleteReservation);

export default router;