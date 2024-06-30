import multer from "multer";

const memoryStorage = multer.memoryStorage()

export const uploadFile = multer ({
    storage: memoryStorage,
})