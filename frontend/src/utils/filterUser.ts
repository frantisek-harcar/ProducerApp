import { User as UserModel } from '../models/user';

export function filterUser(fileUserId: string, users: UserModel[]): UserModel | null {
    const foundUser = users.find(user => {
        return fileUserId === user._id
    })

    if (!foundUser) {
        return null;
    }

    return foundUser
}