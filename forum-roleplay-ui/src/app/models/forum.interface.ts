import { User } from './user.interface';

export interface Forum {
    theme: string;
    creator: User;
    post: Post[];
    players: User[];
    playerNumber: number;
    minLevel: number;
}

interface Post {
    pcreator: User;
    content: string;
    thread: Thread[];
}

interface Thread {
    mcreator: User;
    message: string;
}