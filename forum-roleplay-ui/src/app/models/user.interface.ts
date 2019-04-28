import { Character } from './character.interface';

export interface User {
    id: string;
    username: string;
    password: string;
    character: Character[];
}