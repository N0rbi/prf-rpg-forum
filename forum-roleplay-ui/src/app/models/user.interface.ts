import { Character } from './character.interface';

export interface User {
    _id: string;
    username: string;
    password: string;
    characters: Character[];
    __v: number;
}