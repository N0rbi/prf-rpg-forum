import { User } from './user.interface';

export interface Forum {
    theme: string;
    creator: any;
    post?: Post[];
    players?: any[];
    playerNumber: number;
    minLevel: number;
}

interface Post {
    pcreator: any;
    content: string;
    thread: Thread[];
}

interface Thread {
    mcreator: any;
    message: string;
}