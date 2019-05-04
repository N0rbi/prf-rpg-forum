import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Character } from '../models/character.interface';

@Injectable({
  providedIn: 'root'
})
export class CharacterService {

  raceCollection = [
    'orc',
    'human',
    'elf'
  ];

  typeCollection = [
    'bowman',
    'mage',
    'assassin'
  ];

  constructor(private http: HttpClient) { }

  createNewCharacter(character: Character): Observable<any> {
    return this.http.put(`${environment.backendUrl}/character`, character, {withCredentials: true});
  }

  deleteCharacter(characterID: string) {
    return this.http.delete(`${environment.backendUrl}/character?character_id=${characterID}`, {withCredentials: true});
  }
}
