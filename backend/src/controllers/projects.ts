import { RequestHandler } from "express";
import createHttpError from "http-errors";
import mongoose, { Types } from "mongoose";
import ProjectModel from "../models/project"
import ChatModel from "../models/chat"
import TagModel from "../models/tag"
import ReservationModel from "../models/reservation"
import MessageModel from "../models/message";
import UserModel from "../models/user"
import { assertIsDefined } from "../util/assertIsDefined";

export const getAllProjects: RequestHandler = async (req, res, next) => {

    console.log("__________________________________________________");
    console.log(req.session.userId);
    console.log(req.session);

    const authenticatedUserId: Types.ObjectId | undefined = req.session.userId;
    
    try {
        assertIsDefined(authenticatedUserId);

        const user = await UserModel.findById(authenticatedUserId).exec();

        if (user?.admin) {
            const projects = await ProjectModel.find()
                .populate({ path: "tags", model: TagModel })
                .populate({ path: "reservations", model: ReservationModel })
                .populate({ path: "chatId", model: ChatModel, populate: { path: "messages", model: MessageModel, select: "status senderId recipientId" } })
                .exec();
            res.status(200).json(projects);
        } else {
            const projects = await ProjectModel.find({ userId: authenticatedUserId, archived: false })
                .populate({ path: "tags", model: TagModel })
                .populate({ path: "reservations", model: ReservationModel })
                .populate({ path: "chatId", model: ChatModel, populate: { path: "messages", model: MessageModel, select: "status senderId recipientId" } })
                .exec();
            res.status(200).json(projects);
        }
    } catch (error) {
        next(error)
    }
};

export const getUserProjects: RequestHandler = async (req, res, next) => {

    const authenticatedUserId = req.session.userId;
    const userId = req.params.userId

    try {
        assertIsDefined(authenticatedUserId);

        const user = await UserModel.findById(authenticatedUserId).populate({ path: "reservations", model: ReservationModel }).exec();

        if (!user?.admin) {
            throw createHttpError(401, "You are not authorized")
        }

        if (!mongoose.isValidObjectId(userId)) {
            throw createHttpError(400, "Invalid user id")
        }

        const projects = await ProjectModel.find({ userId: userId, archived: false }).exec();
        res.status(200).json(projects);
    } catch (error) {
        next(error)
    }
};

export const getProject: RequestHandler = async (req, res, next) => {
    const authenticatedUserId = req.session.userId;
    const projectId = req.params.projectId;

    try {
        assertIsDefined(authenticatedUserId);

        const user = await UserModel.findById(authenticatedUserId).exec();

        if (!mongoose.isValidObjectId(projectId)) {
            throw createHttpError(400, "Invalid project id");
        }

        const project = await ProjectModel.findById(projectId).populate({ path: "reservations", model: ReservationModel }).exec();

        if (!project) {
            throw createHttpError(404, "Project not found");
        }

        if (!user?.admin) {
            if (!project?.userId.equals(user?.id)) {
                throw createHttpError(401, "You cannot access this project");
            }
        }

        res.status(200).json(project);
    } catch (error) {
        next(error)
    }
};

interface CreateProjectBody {
    name: string,
    isDone?: string,
    userId?: string,
    chatId: string,
}

export const createProject: RequestHandler<unknown, unknown, CreateProjectBody, unknown> = async (req, res, next) => {
    const name = req.body.name;
    const isDone = req.body.isDone;
    const userId = req.body.userId;
    const authenticatedUserId = req.session.userId;

    try {
        assertIsDefined(authenticatedUserId);
        const user = await UserModel.findById(authenticatedUserId).exec();

        if (!name) {
            throw createHttpError(400, "Project must have a name");
        }

        const existingId = await UserModel.findOne({ userId: userId }).exec();

        if (!existingId) {
            throw createHttpError(400, "User not found.");
        }

        if (!user?.admin) {
            throw createHttpError(401, "You are not authorized");
        }

        const newChat = new ChatModel()

        await newChat.save()

        const newProject = await ProjectModel.create({
            name: name,
            isDone: isDone,
            userId: userId,
            chatId: newChat._id
        });



        res.status(201).json(newProject);
    } catch (error) {
        next(error);
    }
};

interface UpdateProjectParams {
    projectId: string,
}

interface UpdateProjectBody {
    name?: string,
    isDone?: string,
    userId?: string,
    tags?: string[]
}

export const updateProject: RequestHandler<UpdateProjectParams, unknown, UpdateProjectBody, unknown> = async (req, res, next) => {
    const projectId = req.params.projectId;
    const newName = req.body.name;
    const newIsDone = req.body.isDone;
    const newUserId = req.body.userId;
    const newTags = req.body.tags;
    let newIsDoneConverted: Date | undefined = undefined
    const authenticatedUserId = req.session.userId;

    try {
        assertIsDefined(authenticatedUserId);

        const user = await UserModel.findById(authenticatedUserId).exec();

        if (!mongoose.isValidObjectId(projectId)) {
            throw createHttpError(400, "Invalid project id");
        }

        if (!newName) {
            throw createHttpError(400, "Project must have a name");
        }

        if (newIsDone) {
            newIsDoneConverted = new Date(newIsDone)
        }

        const existingId = await UserModel.findOne({ userId: newUserId }).exec();

        if (!existingId) {
            throw createHttpError(400, "User not found.");
        }

        const project = await ProjectModel.findById(projectId).exec();

        if (!project) {
            throw createHttpError(404, "Project not found");
        }

        if (!user?.admin) {
            throw createHttpError(401, "You are not authorized");
        }

        project.name = newName;
        project.userId = new mongoose.Types.ObjectId(newUserId);

        if (newIsDoneConverted) {
            project.isDone = newIsDoneConverted;
        } else {
            project.isDone = undefined;
        }

        if (newTags) {
            const tagObjectIds: Types.ObjectId[] = newTags.map((tagId) => new mongoose.Types.ObjectId(tagId));
            project.tags = tagObjectIds;
        }

        const updatedProject = await project.save();

        res.status(200).json(updatedProject);

    } catch (error) {
        next(error)
    }
};

export const archiveProject: RequestHandler = async (req, res, next) => {
    const projectId = req.params.projectId;

    const authenticatedUserId = req.session.userId;

    try {
        assertIsDefined(authenticatedUserId);

        const user = await UserModel.findById(authenticatedUserId).exec();

        if (!mongoose.isValidObjectId(projectId)) {
            throw createHttpError(400, "Invalid project id");
        }

        const project = await ProjectModel.findById(projectId).exec();

        if (!project) {
            throw createHttpError(404, "Project not found");
        }

        if (!user?.admin) {
            throw createHttpError(401, "You are not authorized");
        }

        project.archived = !project.archived;

        const updatedProject = await project.save();

        res.status(200).json(updatedProject);

    } catch (error) {
        next(error)
    }
};

interface UpdateTagsBody {
    tags: string[];
}

export const updateTags: RequestHandler<UpdateProjectParams, unknown, UpdateTagsBody, unknown> = async (req, res, next) => {

    const projectId = req.params.projectId;
    const newTags = req.body.tags;
    const authenticatedUserId = req.session.userId;

    try {
        assertIsDefined(authenticatedUserId);

        const user = await UserModel.findById(authenticatedUserId).exec();

        if (!mongoose.isValidObjectId(projectId)) {
            throw createHttpError(400, "Invalid project id");
        }

        const project = await ProjectModel.findById(projectId).exec();

        if (!project) {
            throw createHttpError(404, "Project not found");
        }

        if (!newTags) {
            throw createHttpError(400, "No tags entered");
        }

        if (!user?.admin) {
            throw createHttpError(401, "You are not authorized");
        }

        const tagObjectIds: Types.ObjectId[] = newTags.map((tagId) => new mongoose.Types.ObjectId(tagId));
        project.tags = tagObjectIds;

        const updatedProject = await project.save();

        res.status(200).json(updatedProject);

    } catch (error) {
        next(error)
    }
}

export const deleteProject: RequestHandler = async (req, res, next) => {
    const projectId = req.params.projectId;
    const authenticatedUserId = req.session.userId;

    try {
        assertIsDefined(authenticatedUserId);

        const user = await UserModel.findById(authenticatedUserId).exec();

        if (!mongoose.isValidObjectId(projectId)) {
            throw createHttpError(400, "Invalid project id");
        }

        const project = await ProjectModel.findById(projectId).exec();

        if (!project) {
            throw createHttpError(404, "Project not found");
        }

        if (!user?.admin) {
            throw createHttpError(401, "You are not authorized");
        }

        await ChatModel.findByIdAndDelete(project.chatId);

        await project.remove();

        res.sendStatus(204);
    } catch (error) {
        next(error);
    }
};

export const getChat: RequestHandler = async (req, res, next) => {

    const authenticatedUserId = req.session.userId;
    const projectId = req.params.projectId

    try {
        assertIsDefined(authenticatedUserId);

        const project = await ProjectModel.findById(projectId).exec();

        if (!project) {
            throw createHttpError(404, "Project not found");
        }

        if (!mongoose.isValidObjectId(projectId)) {
            throw createHttpError(400, "Invalid project id");
        }

        const messages = await ChatModel.findById(project.chatId).populate("messages");

        res.status(200).json(messages);
    } catch (error) {
        next(error);
    }
};

interface UpdateChatBody {
    message: string,
    userId: string,
    senderId: string,
    recipientId: string,
    chatId: string
}

export const updateChat: RequestHandler<unknown, unknown, UpdateChatBody, unknown> = async (req, res, next) => {
    const message = req.body.message;
    const userId = req.body.userId;
    const senderId = req.body.senderId;
    const recipientId = req.body.recipientId;
    const chatId = req.body.chatId;
    const authenticatedUserId = req.session.userId;

    try {
        assertIsDefined(authenticatedUserId);

        if (!message) {
            throw createHttpError(400, "Message must have content");
        }

        if (!userId) {
            throw createHttpError(400, "Message must belong to a user");
        }

        if (!senderId) {
            throw createHttpError(400, "Message must have a sender");
        }

        if (!recipientId) {
            throw createHttpError(400, "Message must have a recipient");
        }

        const chat = await ChatModel.findById(chatId);

        if (!chat) {
            throw createHttpError(404, "Chat not found");
        }

        const newMessage = await MessageModel.create({
            message: message,
            userId: userId,
            senderId: senderId,
            recipientId: recipientId,
        });

        chat.messages.push(newMessage._id);

        await chat?.save();

        res.sendStatus(200);
    } catch (error) {
        next(error);
    }
};

interface ReadMessagesBody {
    messageIds: string[]
    chatId: string,
}

export const readMessages: RequestHandler<unknown, unknown, ReadMessagesBody, unknown> = async (req, res, next) => {
    const messageIds = req.body.messageIds;
    const chatId = req.body.chatId;
    const authenticatedUserId = req.session.userId;

    try {
        assertIsDefined(authenticatedUserId);

        if (!messageIds || messageIds.length === 0) {
            throw createHttpError(400, 'No message IDs submitted for update');
        }

        if (!authenticatedUserId) {
            throw createHttpError(400, "User must be authenticated");
        }

        const chat = await ChatModel.findById(chatId);

        if (!chat) {
            throw createHttpError(404, "Chat not found");
        }

        const messagesToUpdate = await MessageModel.find({ _id: { $in: messageIds } });

        for (const message of messagesToUpdate) {
            if (chat.messages.includes(message._id)) {
                message.status = "read";
                await message.save();
            }
        }

        res.sendStatus(200);
    } catch (error) {
        next(error);
    }
};