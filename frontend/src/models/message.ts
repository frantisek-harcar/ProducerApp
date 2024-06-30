export enum MessageStatus {
    Read = "read",
    Unread = "unread",
}

export interface Message {
    _id: string,
    message: string,
    userId: string,
    senderId: string,
    recipientId: string,
    status: MessageStatus,
    createdAt: Date,
}