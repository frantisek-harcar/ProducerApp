import express from "express";
import * as PaymentItemsController from "../controllers/paymentItems";

const router = express.Router();

router.get("/project/:projectId", PaymentItemsController.getProjectPaymentItems);

router.get("/", PaymentItemsController.getAllPaymentItems);

router.get("/:paymentItemId", PaymentItemsController.getPaymentItem);

router.post("/", PaymentItemsController.createPaymentItem);

router.patch("/:paymentItemId", PaymentItemsController.updatePaymentItem);

router.delete("/:paymentItemId", PaymentItemsController.deletePaymentItem);

export default router;