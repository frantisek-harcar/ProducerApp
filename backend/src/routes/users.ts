import express from "express";
import * as UsersController from "../controllers/users";
import { requiresAuth } from "../middleware/auth";

const router = express.Router();

router.get("/", UsersController.getAuthenticatedUser);

router.get("/list", UsersController.getUsers);

router.get("/:userId", requiresAuth, UsersController.getUser);

router.get("/list/admin", requiresAuth, UsersController.getAdmin);

router.post("/", requiresAuth, UsersController.createUser);

router.post("/login", UsersController.login);

router.post("/logout", UsersController.logout);

router.patch("/:userId", UsersController.updateUser);

router.patch("/user/changePassword", requiresAuth, UsersController.changePassword);

router.delete("/:userId", UsersController.deleteUser);

export default router;