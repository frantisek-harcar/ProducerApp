import { Tag } from './tag';

export interface File {
    _id: string,
    originalName: string,
    price: number,
    isPaid: Date,
    userId: string,
    googleDriveId: string,
    size: number,
    downloadLink: string,
    tags: Tag[],
    createdAt: string,
    updatedAt: string
}