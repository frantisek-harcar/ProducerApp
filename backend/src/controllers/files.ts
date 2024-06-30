import { RequestHandler } from "express";
import createHttpError from "http-errors";
import FileModel from "../models/file";
import ProjectModel from "../models/project";
import UserModel from "../models/user"
import TagModel from "../models/tag"
import { GoogleDriveService } from "../services/GoogleDriveService";
import { assertIsDefined } from "../util/assertIsDefined";
import mongoose, { Types } from "mongoose";

// export const uploadFile: RequestHandler = async (req, res, next) => {
//     try {
//         console.log(req.file);
//         res.send("Single file uploaded successfuly");
//     } catch (error) {
//         next(error)
//     }
// }
// export const uploadFile: RequestHandler = async (req, res, next) => {
//     try {
//         const fileResponse = await GoogleDriveService.uploadToGoogleDrive(req.file)
//         res.status(200).send("Single file uploaded successfuly");
//     } catch (error) {
//         next(error)
//     }
// }

interface CreateFileBody {
    price?: string,
    userId: boolean,
    projectId?: string
}

export const createFile: RequestHandler<unknown, unknown, CreateFileBody, unknown> = async (req, res, next) => {

    const file = req.file;
    const price = req.body.price;
    const userId = req.body.userId;
    const projectId = req.body.projectId;

    const authenticatedUserId = req.session.userId;

    try {

        assertIsDefined(authenticatedUserId);

        const user = await UserModel.findById(authenticatedUserId).exec();

        if (!user) {
            throw createHttpError(400, "User unauthenticated");
        }

        if (!file) {
            throw createHttpError(400, "File is missing");
        }

        if (!userId) {
            throw createHttpError(400, "File must be uploaded by a user");
        }

        const fileResponse = await GoogleDriveService.uploadToGoogleDrive(file)

        const newFile = await FileModel.create({
            originalName: file.originalname,
            price: price,
            userId: userId,
            size: file.size,
            googleDriveId: fileResponse.data.id,
            downloadLink: fileResponse.data.webContentLink
        });

        if (projectId) {
            const project = await ProjectModel.findById(projectId);

            if (!project) {
                throw createHttpError(404, "Project not found");
            }

            if (project.files.includes(newFile.id)) {
                throw createHttpError(400, "File is already in this project");
            }

            project.files.push(newFile.id)

            await project?.save();
        }

        res.status(201).json(newFile);
    } catch (error) {
        next();
    }
}

export const getFiles: RequestHandler = async (req, res, next) => {
    const authenticatedUserId = req.session.userId;

    try {
        assertIsDefined(authenticatedUserId);

        const user = await UserModel.findById(authenticatedUserId).exec();

        if (!user) {
            throw createHttpError(400, "User unauthenticated");
        }

        if (user.admin) {
            const files = await FileModel.find().populate({ path: "tags", model: TagModel }).exec();
            res.status(200).json(files);
        } else {
            const projects = await ProjectModel.find({ userId: user._id }).populate({path: "files", model: FileModel, populate: {path: "tags", model: TagModel} }).exec();
            const files = projects.map(project => project.files).flat();
            // const files = await FileModel.find({ userId: user.id }).populate({ path: "tags", model: TagModel }).exec();
            res.status(200).json(files);
        }
    } catch (error) {
        next()
    }
}

export const deleteFile: RequestHandler = async (req, res, next) => {
    const fileId = req.params.fileId;
    const authenticatedUserId = req.session.userId;

    try {
        assertIsDefined(authenticatedUserId);

        const user = await UserModel.findById(authenticatedUserId).exec();

        if (!user) {
            throw createHttpError(400, "User unauthenticated");
        }

        if (!mongoose.isValidObjectId(fileId)) {
            throw createHttpError(400, "Invalid file id");
        }

        const file = await FileModel.findById(fileId).exec();

        if (!file) {
            throw createHttpError(404, "File not found");
        }

        if (!user?.admin) {
            throw createHttpError(401, "You are not authorized");
        }

        await GoogleDriveService.deleteFile(file.googleDriveId)

        await file.remove();

        res.sendStatus(204);
    } catch (error) {
        next(error);
    }
};

interface UpdateFileParams {
    fileId: string,
}

interface UpdateFileBody {
    price: number,
    tags?: string[]
}

export const updateFile: RequestHandler<UpdateFileParams, unknown, UpdateFileBody, unknown> = async (req, res, next) => {
    const fileId = req.params.fileId;
    const newPrice = req.body.price;
    const newTags = req.body.tags;
    const authenticatedUserId = req.session.userId;

    try {
        assertIsDefined(authenticatedUserId);

        const user = await UserModel.findById(authenticatedUserId).exec();

        if (!mongoose.isValidObjectId(fileId)) {
            throw createHttpError(400, "Invalid file id");
        }

        const file = await FileModel.findById(fileId).exec();

        if (!file) {
            throw createHttpError(404, "File not found");
        }

        if (!user?.admin) {
            throw createHttpError(401, "You are not authorized");
        }

        const updateQuery = { price: newPrice }

        if (newTags) {
            const tagObjectIds: Types.ObjectId[] = newTags.map((tagId) => new mongoose.Types.ObjectId(tagId));
            file.tags = tagObjectIds;
        }

        const updatedFile = await FileModel.findOneAndUpdate({ id: fileId }, { $set: updateQuery }, { new: true });

        res.status(200).json(updatedFile);

    } catch (error) {
        next(error)
    }
};

interface UpdateTagsBody {
    tags: string[];
}

export const updateTags: RequestHandler<UpdateFileParams, unknown, UpdateTagsBody, unknown> = async (req, res, next) => {

    const fileId = req.params.fileId;
    const newTags = req.body.tags;
    const authenticatedUserId = req.session.userId;

    try {
        assertIsDefined(authenticatedUserId);

        const user = await UserModel.findById(authenticatedUserId).exec();

        if (!mongoose.isValidObjectId(fileId)) {
            throw createHttpError(400, "Invalid file id");
        }

        const file = await FileModel.findById(fileId).exec();

        if (!file) {
            throw createHttpError(404, "File not found");
        }

        if (!newTags) {
            throw createHttpError(400, "No tags entered");
        }

        if (!user?.admin) {
            throw createHttpError(401, "You are not authorized");
        }

        const tagObjectIds: Types.ObjectId[] = newTags.map((tagId) => new mongoose.Types.ObjectId(tagId));
        file.tags = tagObjectIds;

        const updatedFile = await file.save();

        res.status(200).json(updatedFile);

    } catch (error) {
        next(error)
    }
}