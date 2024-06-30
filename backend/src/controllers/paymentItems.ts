import { RequestHandler } from "express";
import { assertIsDefined } from "../util/assertIsDefined";
import createHttpError from "http-errors";
import ProjectModel from "../models/project";
import UserModel from "../models/user";
import PaymentItemModel from "../models/paymentItem";
import mongoose from "mongoose";

interface CreatePaymentItemBody {
    name: string,
    price: number,
    isPaid?: string,
    projectId: string,
}

export const getPaymentItem: RequestHandler = async (req, res, next) => {
    const authenticatedUserId = req.session.userId;
    const paymentItemId = req.params.paymentItemId;

    try {
        assertIsDefined(authenticatedUserId);

        const user = await UserModel.findById(authenticatedUserId).exec();

        if (!user?.admin) {
            throw createHttpError(401, "You are not authorized");
        }

        if (!mongoose.isValidObjectId(paymentItemId)) {
            throw createHttpError(400, "Invalid payment item id");
        }

        const paymentItem = await PaymentItemModel.findById(paymentItemId).exec();

        if (!paymentItem) {
            throw createHttpError(404, "Payment item not found");
        }

        res.status(200).json(paymentItem);
    } catch (error) {
        next(error)
    }
};

export const getProjectPaymentItems: RequestHandler = async (req, res, next) => {

    const authenticatedUserId = req.session.userId;
    const projectId = req.body.projectId

    try {
        assertIsDefined(authenticatedUserId);

        if (!mongoose.isValidObjectId(projectId)) {
            throw createHttpError(400, "Invalid project id")
        }

        const paymentItems = await PaymentItemModel.find({ projectId: projectId }).exec();

        res.status(200).json(paymentItems);
    } catch (error) {
        next(error)
    }
};

export const getAllPaymentItems: RequestHandler = async (req, res, next) => {
    const authenticatedUserId = req.session.userId;

    try {
        assertIsDefined(authenticatedUserId);

        const paymentItems = await PaymentItemModel.find().exec();
        res.status(200).json(paymentItems);

    } catch (error) {
        next(error)
    }
};

export const createPaymentItem: RequestHandler<unknown, unknown, CreatePaymentItemBody, unknown> = async (req, res, next) => {
    const name = req.body.name;
    const price = req.body.price;
    const isPaid = req.body.isPaid;
    const projectId = req.body.projectId;
    const authenticatedUserId = req.session.userId;

    try {
        assertIsDefined(authenticatedUserId);
        const user = await UserModel.findById(authenticatedUserId).exec();

        if (!name) {
            throw createHttpError(400, "Payment item must have a name");
        }

        if (!price) {
            throw createHttpError(400, "Payment item must have a price");
        }

        const existingId = await ProjectModel.findOne({ projectId: projectId }).exec();

        if (!existingId) {
            throw createHttpError(400, "Project not found.");
        }

        if (!user?.admin) {
            throw createHttpError(401, "You are not authorized");
        }

        const newPaymentItemData = {
            name: name,
            price: price,
            isPaid: isPaid,
            projectId: projectId
        };
        
        if (price === 0) {
            newPaymentItemData.isPaid = new Date().toISOString();
        }
        
        const newPaymentItem = await PaymentItemModel.create(newPaymentItemData);
        res.status(201).json(newPaymentItem);
    } catch (error) {
        next(error);
    }
};

interface UpdatePaymentItemParams {
    paymentItemId: string,
}

interface UpdatePaymentItemBody {
    name: string,
    price: number,
    isPaid?: string,
}

export const updatePaymentItem: RequestHandler<UpdatePaymentItemParams, unknown, UpdatePaymentItemBody, unknown> = async (req, res, next) => {
    const paymentItemId = req.params.paymentItemId;
    const newName = req.body.name;
    const newPrice = req.body.price;
    const newIsPaid = req.body.isPaid;
    let newIsPaidConverted: Date | undefined = undefined
    const authenticatedUserId = req.session.userId;

    try {
        assertIsDefined(authenticatedUserId);

        const user = await UserModel.findById(authenticatedUserId).exec();

        if (!mongoose.isValidObjectId(paymentItemId)) {
            throw createHttpError(400, "Invalid payment item id");
        }

        if (!newName) {
            throw createHttpError(400, "Payment item must have a name");
        }

        if (!newPrice) {
            throw createHttpError(400, "Payment item must have a price");
        }

        if (newIsPaid) {
            newIsPaidConverted = new Date(newIsPaid)
        }

        const paymentItem = await PaymentItemModel.findById(paymentItemId).exec();

        if (!paymentItem) {
            throw createHttpError(404, "Project not found");
        }

        if (!user?.admin) {
            throw createHttpError(401, "You are not authorized");
        }

        paymentItem.name = newName;
        paymentItem.price = newPrice;
        paymentItem.isPaid = newIsPaidConverted;

        const updatedPaymentItem = await paymentItem.save();

        res.status(200).json(updatedPaymentItem);

    } catch (error) {
        next(error)
    }
};

export const deletePaymentItem: RequestHandler = async (req, res, next) => {
    const paymentItemId = req.params.paymentItemId;
    const authenticatedUserId = req.session.userId;

    try {
        assertIsDefined(authenticatedUserId);

        const user = await UserModel.findById(authenticatedUserId).exec();

        if (!mongoose.isValidObjectId(paymentItemId)) {
            throw createHttpError(400, "Invalid payment item id");
        }

        const paymentItem = await PaymentItemModel.findById(paymentItemId).exec();

        if (!paymentItem) {
            throw createHttpError(404, "Payment item not found");
        }

        if (!user?.admin) {
            throw createHttpError(401, "You are not authorized");
        }

        await paymentItem.remove();

        res.sendStatus(204);
    } catch (error) {
        next(error);
    }
};
