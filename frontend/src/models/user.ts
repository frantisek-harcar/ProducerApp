export interface User {
    _id: string,
    name?: string,
    password: string,
    email: string,
    admin?: boolean,
    createdAt: string,
    updatedAt: string
}