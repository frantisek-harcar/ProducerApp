import express from "express";
import * as TagsController from "../controllers/tags";

const router = express.Router();

router.get("/", TagsController.getTags);

router.get("/:tagId", TagsController.getTag);

router.post("/", TagsController.createTag);

router.patch("/:tagId", TagsController.updateTag);

router.delete("/:tagId", TagsController.deleteTag);

export default router;