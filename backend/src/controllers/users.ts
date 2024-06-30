import { RequestHandler } from "express";
import createHttpError from "http-errors";
import mongoose from "mongoose";
import UserModel from "../models/user";
import bcrypt from "bcrypt";
import { assertIsDefined } from "../util/assertIsDefined";
import { sendEmail } from "../services/nodemailer";
import env from "../util/validateEnv";

export const getUsers: RequestHandler = async (req, res, next) => {
    try {
        const users = await UserModel.find().exec();
        res.status(200).json(users);
    } catch (error) {
        next(error)
    }
};

export const getUser: RequestHandler = async (req, res, next) => {
    const userId = req.params.userId;

    try {
        if (!mongoose.isValidObjectId(userId)) {
            throw createHttpError(400, "Invalid user id")
        }

        const user = await UserModel.findById(userId).exec();

        if (!user) {
            throw createHttpError(404, "User not found")
        }

        res.status(200).json(user);
    } catch (error) {
        next(error)
    }
};

export const getAdmin: RequestHandler = async (req, res, next) => {
    try {
        const user = await UserModel.find({ admin: true }).exec();

        if (!user) {
            throw createHttpError(404, "Admin not found")
        }

        res.status(200).json(user);
    } catch (error) {
        next(error)
    }
};

interface CreateUserBody {
    name?: string,
    password: string,
    email: string,
    admin?: boolean
}

export const createUser: RequestHandler<unknown, unknown, CreateUserBody, unknown> = async (req, res, next) => {
    const name = req.body.name;
    const passwordRaw = req.body.password;
    const email = req.body.email;

    try {
        if (!email) {
            throw createHttpError(400, "User must have an email");
        }

        if (!passwordRaw) {
            throw createHttpError(400, "User must have a password")
        }

        const existingEmail = await UserModel.findOne({ email: email }).exec();

        if (existingEmail) {
            throw createHttpError(409, "Email already taken. Please choose a different email.");
        }

        const passwordHashed = await bcrypt.hash(passwordRaw, 10);

        const newUser = await UserModel.create({
            name: name,
            email: email,
            password: passwordHashed,
        });

        const sendTo = email
        const sendFrom = env.EMAIL_USER
        const reply_to = email
        const subject = "Account created"
        const message = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>New account created</title>
            <style>
                body {
                    font-family: Arial, sans-serif;
                    background-color: #f4f4f4;
                    color: #333;
                    margin: 0;
                    padding: 0;
                }
    
                .container {
                    max-width: 600px;
                    margin: 20px auto;
                    padding: 20px;
                    background-color: #fff;
                    border-radius: 5px;
                    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
                }
    
                h3 {
                    color: #007bff;
                }
    
                p {
                    line-height: 1.6;
                }
    
                a {
                    color: #007bff;
                    text-decoration: none;
                }
    
                a:hover {
                    text-decoration: underline;
                }
            </style>
        </head>
        <body>
            <div class="container">
                <h3>New Password for Producer App</h3>
                <p>Your account has been created with the following password:</p>
                <p style="font-weight: bold; font-size: 1.2em;">${passwordRaw}</p>
                <p>Please change your password in the settings of the application.</p>
                <p>You can access the page at <a href="https://producer-app.onrender.com/">producer-app.onrender.com</a>.</p>
            </div>
        </body>
        </html>
    `;


        await sendEmail(subject, message, sendTo, sendFrom, reply_to)

        res.status(201).json(newUser);
    } catch (error) {
        next(error);
    }
};

interface UpdateUserParams {
    userId: string,
}

interface UpdateUserBody {
    name?: string,
    password?: string,
    email?: string,
    admin?: boolean
}

export const updateUser: RequestHandler<UpdateUserParams, unknown, UpdateUserBody, unknown> = async (req, res, next) => {
    const userId = req.params.userId;
    const newName = req.body.name;
    const newPassword = req.body.password;
    const newEmail = req.body.email;
    const newAdmin = req.body.admin;

    try {
        if (!mongoose.isValidObjectId(userId)) {
            throw createHttpError(400, "Invalid user id");
        }

        if (!newEmail) {
            throw createHttpError(400, "User must have an email");
        }

        if (!newPassword) {
            throw createHttpError(400, "User must have a password");
        }

        const passwordHashed = await bcrypt.hash(newPassword, 10);

        const user = await UserModel.findById(userId).exec();

        if (!user) {
            throw createHttpError(404, "User not found");
        }

        user.name = newName;
        user.password = passwordHashed;
        user.email = newEmail;
        // user.admin = newAdmin ?? false;

        const updatedUser = await user.save();

        res.status(200).json(updatedUser);

    } catch (error) {
        next(error)
    }
};

export const deleteUser: RequestHandler = async (req, res, next) => {
    const userId = req.params.userId;

    try {
        if (!mongoose.isValidObjectId(userId)) {
            throw createHttpError(400, "Invalid user id");
        }

        const user = await UserModel.findById(userId).exec();

        if (!user) {
            throw createHttpError(404, "User not found");
        }

        await user.remove();

        res.sendStatus(204);
    } catch (error) {
        next(error);
    }
};

export const getAuthenticatedUser: RequestHandler = async (req, res, next) => {
    try {
        const user = await UserModel.findById(req.session.userId).exec();
        res.status(200).json(user);
    } catch (error) {
        next()
    }
}

interface LoginBody {
    email?: string,
    password?: string,
}

export const login: RequestHandler<unknown, unknown, LoginBody, unknown> = async (req, res, next) => {
    const password = req.body.password;
    const email = req.body.email;

    try {
        if (!email || !password) {
            throw createHttpError(400, "Parameters missing");
        }

        const user = await UserModel.findOne({ email: email }).select("+password").exec();

        if (!user) {
            throw createHttpError(401, "Invalid credentials");
        }

        const passwordMatch = await bcrypt.compare(password, user.password);

        if (!passwordMatch) {
            throw createHttpError(401, "Invalid credentials");
        }

        req.session.userId = user._id;

        res.status(201).json(user);
    } catch (error) {
        next(error)
    }
};

interface ChangePasswordBody {
    oldPassword: string,
    newPassword: string,
    newPasswordConfirmation: string,
}

export const changePassword: RequestHandler<unknown, unknown, ChangePasswordBody, unknown> = async (req, res, next) => {
    const oldPassword = req.body.oldPassword;
    const newPassword = req.body.newPassword;
    const newPasswordConfirmation = req.body.newPasswordConfirmation;
    const authenticatedUserId = req.session.userId;

    assertIsDefined(authenticatedUserId);
    try {
        const user = await UserModel.findById(authenticatedUserId).select("+password").exec();

        if (!user) {
            throw createHttpError(401, "User not found")
        }

        if (!oldPassword) {
            throw createHttpError(400, "Parameters missing");
        }

        if (!newPassword) {
            throw createHttpError(400, "Parameters missing");
        }

        const passwordMatch = await bcrypt.compare(oldPassword, user.password);

        if (!passwordMatch) {
            throw createHttpError(401, "Old password doesnt match current password");
        }

        if (newPassword !== newPasswordConfirmation) {
            throw createHttpError(401, "New passwords dont match");
        }

        const newPasswordHashed = await bcrypt.hash(newPassword, 10);

        user.password = newPasswordHashed;

        const updatedUser = await user.save();

        res.status(200).json(updatedUser);
    } catch (error) {
        next(error)
    }
};

export const logout: RequestHandler = (req, res, next) => {
    req.session.destroy(error => {
        if (error) {
            next(error);
        } else {
            res.sendStatus(200);
        }
    })
}