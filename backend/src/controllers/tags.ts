import { RequestHandler } from "express";
import createHttpError from "http-errors";
import mongoose from "mongoose";
import TagModel from "../models/tag"
import UserModel from "../models/user"
import { assertIsDefined } from "../util/assertIsDefined";

export const getTags: RequestHandler = async (req, res, next) => {
    const authenticatedUserId = req.session.userId;

    try {
        assertIsDefined(authenticatedUserId);

        const user = await UserModel.findById(authenticatedUserId).exec();

        if (user?.admin) {
            const tags = await TagModel.find().exec();
            res.status(200).json(tags);
        } else {
            throw createHttpError(401, "You cannot access tags");
        }

    } catch (error) {
        next(error)
    }
};

export const getTag: RequestHandler = async (req, res, next) => {
    const authenticatedUserId = req.session.userId;
    const tagId = req.params.tagId;

    try {
        assertIsDefined(authenticatedUserId);

        const user = await UserModel.findById(authenticatedUserId).exec();

        if (!mongoose.isValidObjectId(tagId)) {
            throw createHttpError(400, "Invalid tag id");
        }

        const tag = await TagModel.findById(tagId).exec();

        if (!tag) {
            throw createHttpError(404, "Tag not found");
        }

        if (!user?.admin) {
            throw createHttpError(401, "You cannot access tags");
        }

        res.status(200).json(tag);
    } catch (error) {
        next(error)
    }
};

interface CreateTagBody {
    name: string,
    color?: string,
}

export const createTag: RequestHandler<unknown, unknown, CreateTagBody, unknown> = async (req, res, next) => {
    const name = req.body.name;
    const color = req.body.color;
    const authenticatedUserId = req.session.userId;

    try {
        assertIsDefined(authenticatedUserId);
        const user = await UserModel.findById(authenticatedUserId).exec();

        if (!name) {
            throw createHttpError(400, "Tag must have a name");
        }

        if (!user?.admin) {
            throw createHttpError(401, "You are not authorized");
        }

        const newTag = await TagModel.create({
            name: name,
            color: color,
        });

        res.status(201).json(newTag);
    } catch (error) {
        next(error);
    }
};

interface UpdateTagParams {
    tagId: string,
}

interface UpdateTagBody {
    name?: string,
    color?: string,
}

export const updateTag: RequestHandler<UpdateTagParams, unknown, UpdateTagBody, unknown> = async (req, res, next) => {
    const tagId = req.params.tagId;
    const newName = req.body.name;
    const newColor = req.body.color;
    const authenticatedUserId = req.session.userId;

    try {
        assertIsDefined(authenticatedUserId);

        const user = await UserModel.findById(authenticatedUserId).exec();

        if (!mongoose.isValidObjectId(tagId)) {
            throw createHttpError(400, "Invalid tag id");
        }

        if (!newName) {
            throw createHttpError(400, "Tag must have a name");
        }

        const tag = await TagModel.findById(tagId).exec();

        if (!tag) {
            throw createHttpError(404, "Tag not found");
        }

        if (!user?.admin) {
            throw createHttpError(401, "You are not authorized");
        }

        tag.name = newName;
        tag.color = newColor

        const updatedTag = await tag.save();

        res.status(200).json(updatedTag);

    } catch (error) {
        next(error)
    }
};

export const deleteTag: RequestHandler = async (req, res, next) => {
    const tagId = req.params.tagId;
    const authenticatedUserId = req.session.userId;

    try {
        assertIsDefined(authenticatedUserId);

        const user = await UserModel.findById(authenticatedUserId).exec();

        if (!mongoose.isValidObjectId(tagId)) {
            throw createHttpError(400, "Invalid tag id");
        }

        const tag = await TagModel.findById(tagId).exec();

        if (!tag) {
            throw createHttpError(404, "Tag not found");
        }

        if (!user?.admin) {
            throw createHttpError(401, "You are not authorized");
        }

        await tag.remove();

        res.sendStatus(204);
    } catch (error) {
        next(error);
    }
};