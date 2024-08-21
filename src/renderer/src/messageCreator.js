import { v4 as uuidv4, v4 } from 'uuid';

export function createMessage(user, message) {
    return {
        uuid: v4(),
        user: user,
        message: message,
        timestamp: new Date().getTime()
    }
}