import { RequestHandler } from "express";
import createHttpError from "http-errors";
import ReservationModel from "../models/reservation";
import ProjectModel from "../models/project";
import UserModel from "../models/user"
import { assertIsDefined } from "../util/assertIsDefined";
import mongoose from "mongoose";

interface CreateReservationBody {
    title: string,
    dateFrom: Date,
    dateTo: Date,
    userId: string,
    projectId: string
}

export const createReservation: RequestHandler<unknown, unknown, CreateReservationBody, unknown> = async (req, res, next) => {

    const title = req.body.title;
    const dateFrom = req.body.dateFrom;
    const dateTo = req.body.dateTo;
    const userId = req.body.userId;
    const projectId = req.body.projectId;

    const authenticatedUserId = req.session.userId;

    try {
        assertIsDefined(authenticatedUserId);

        const user = await UserModel.findById(authenticatedUserId).exec();

        if (!user) {
            throw createHttpError(400, "User unauthenticated");
        }

        if (!title) {
            throw createHttpError(400, "Title is missing");
        }

        if (!dateFrom) {
            throw createHttpError(400, "Missing a date from");
        }

        if (!dateTo) {
            throw createHttpError(400, "Missing a date to");
        }

        if (!projectId) {
            throw createHttpError(400, "Reservation must be assigned to a project");
        }

        const newReservation = await ReservationModel.create({
            title: title,
            dateFrom: dateFrom,
            dateTo: dateTo,
            userId: userId,
        });

        if (projectId) {
            const project = await ProjectModel.findById(projectId);

            if (!project) {
                throw createHttpError(404, "Project not found");
            }

            if (project.reservations.includes(newReservation.id)) {
                throw createHttpError(400, "Reservation is already in this project");
            }

            project.reservations.push(newReservation.id)

            await project?.save();
        }

        res.status(201).json(newReservation);
    } catch (error) {
        next();
    }
}

export const getReservations: RequestHandler = async (req, res, next) => {
    const authenticatedUserId = req.session.userId;

    try {
        assertIsDefined(authenticatedUserId);

        const user = await UserModel.findById(authenticatedUserId).exec();

        if (!user) {
            throw createHttpError(400, "User unauthenticated");
        }

        if (user?.admin) {
            const reservations = await ReservationModel.find().exec();
            res.status(200).json(reservations);
        } else {
            const reservations = await ReservationModel.find({ userId: user.id }).exec();
            res.status(200).json(reservations);
        }
    } catch (error) {
        next()
    }
}

export const getReservation: RequestHandler = async (req, res, next) => {
    const authenticatedUserId = req.session.userId;
    const reservationId = req.params.reservationId;

    try {
        assertIsDefined(authenticatedUserId);

        const user = await UserModel.findById(authenticatedUserId).exec();

        if (!mongoose.isValidObjectId(reservationId)) {
            throw createHttpError(400, "Invalid reservation id");
        }

        const reservation = await ReservationModel.findById(reservationId).exec();

        if (!reservation) {
            throw createHttpError(404, "Reservation not found");
        }

        if (user?.id !== reservation.userId && !user?.admin) {
            if (!reservation?.userId.equals(user?.id)) {
                throw createHttpError(401, "You cannot access this reservation");
            }
        }

        res.status(200).json(reservation);
    } catch (error) {
        next(error)
    }
};

export const deleteReservation: RequestHandler = async (req, res, next) => {
    const reservationId = req.params.reservationId;
    const authenticatedUserId = req.session.userId;

    try {
        assertIsDefined(authenticatedUserId);

        const user = await UserModel.findById(authenticatedUserId).exec();

        if (!user) {
            throw createHttpError(400, "User unauthenticated");
        }

        if (!mongoose.isValidObjectId(reservationId)) {
            throw createHttpError(400, "Invalid reservation id");
        }

        const reservation = await ReservationModel.findById(reservationId).exec();

        if (!reservation) {
            throw createHttpError(404, "Reservation not found");
        }

        if (!user?.admin) {
            throw createHttpError(401, "You are not authorized");
        }

        await reservation.remove();

        res.sendStatus(204);
    } catch (error) {
        next(error);
    }
};

interface UpdateReservationParams {
    reservationId: string,
}

interface UpdateReservationBody {
    title: string,
    dateFrom: Date,
    dateTo: Date,
    userId: string,
    projectId: string,
}

export const updateReservation: RequestHandler<UpdateReservationParams, unknown, UpdateReservationBody, unknown> = async (req, res, next) => {
    const reservationId = req.params.reservationId;
    const title = req.body.title;
    const dateFrom = req.body.dateFrom;
    const dateTo = req.body.dateTo;
    const userId = req.body.userId;
    const authenticatedUserId = req.session.userId;
    const projectId = req.body.projectId;

    try {
        assertIsDefined(authenticatedUserId);

        const user = await UserModel.findById(authenticatedUserId).exec();

        if (!mongoose.isValidObjectId(reservationId)) {
            throw createHttpError(400, "Invalid reservation id");
        }

        const reservation = await ReservationModel.findById(reservationId).exec();

        if (!reservation) {
            throw createHttpError(404, "Reservation not found");
        }

        if (!user?.admin) {
            throw createHttpError(401, "You are not authorized");
        }

        if (!userId) {
            throw createHttpError(401, "Reservation must have user id");
        }

        if (!projectId) {
            throw createHttpError(401, "Reservation must have project id");
        }

        // const isReservationInProject = await ProjectModel.exists({
        //     _id: projectId,
        //     reservations: reservationId
        // });

        // if (isReservationInProject) {
        //     throw createHttpError(404, "Project already contains this reservation");
        // }

        const reservationObjectId = new mongoose.Types.ObjectId(reservationId);

        const oldProject = await ProjectModel.findOneAndUpdate(
            { reservations: reservationId },
            { $pull: { reservations: reservationObjectId } }
        ).exec();

        if (!oldProject) {
            throw createHttpError(404, "Project containing the reservation not found");
        }

        await oldProject.save();

        const newProject = await ProjectModel.findByIdAndUpdate(projectId,
            { $push: { reservations: reservationObjectId } }
        ).exec();

        if (!newProject) {
            throw createHttpError(404, "New project not found");
        }

        await newProject.save();

        const updateQuery = { title: title, dateFrom: dateFrom, dateTo: dateTo, userId: userId }

        const updatedReservation = await ReservationModel.findOneAndUpdate({ _id: reservationId }, { $set: updateQuery }, { new: true });

        res.status(200).json(updatedReservation);

    } catch (error) {
        next(error)
    }
};