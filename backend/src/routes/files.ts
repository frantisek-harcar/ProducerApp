import express from "express";
import * as FilesController from "../controllers/files";
import { uploadFile } from "../middleware/upload";

const router = express.Router();

// router.post("/single", uploadAvatar.single("avatar"), FilesController.uploadFile)

router.get("/", FilesController.getFiles);

router.patch("/:fileId", FilesController.updateFile);

router.delete("/:fileId", FilesController.deleteFile);


router.post("/createFile", uploadFile.single("file"), FilesController.createFile);

router.patch("/:fileId/tags", FilesController.updateTags);

export default router;