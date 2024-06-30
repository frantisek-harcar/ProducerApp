import { Reservation } from './reservation';
import { Tag } from './tag';
import { Chat } from './chat';

export interface Project {
    _id: string,
    name: string,
    isDone: Date,
    userId: string,
    chatId: Chat,
    files: string[],
    tags: Tag[],
    reservations: Reservation[],
    archived: boolean,
    createdAt: string,
    updatedAt: string
}