import express from "express";
import * as PaymentsController from "../controllers/payments";
import { requiresAuth } from "../middleware/auth";

const router = express.Router();

router.post("/", requiresAuth, PaymentsController.checkout);
router.post("/webhook", PaymentsController.fulfilOrder);

export default router;