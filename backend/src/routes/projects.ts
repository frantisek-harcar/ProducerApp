import express from "express";
import * as ProjectsController from "../controllers/projects";

const router = express.Router();

router.get("/user/:userId", ProjectsController.getUserProjects);

router.get("/", ProjectsController.getAllProjects);

router.get("/:projectId", ProjectsController.getProject);

router.get("/:projectId/chat", ProjectsController.getChat);

router.post("/:projectId/chat", ProjectsController.updateChat);

router.post("/", ProjectsController.createProject);

router.patch("/:projectId", ProjectsController.updateProject);

router.patch("/:projectId/tags", ProjectsController.updateTags);

router.patch("/:projectId/readMessages", ProjectsController.readMessages);

router.patch("/archive/:projectId", ProjectsController.archiveProject);

router.delete("/:projectId", ProjectsController.deleteProject);

export default router;