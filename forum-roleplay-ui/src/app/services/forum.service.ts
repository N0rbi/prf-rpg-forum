import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Forum } from '../models/forum.interface';

@Injectable({
    providedIn: 'root'
})

export class ForumService {

    httpOptions = {};

    constructor(private http: HttpClient) {
        this.httpOptions = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json'
            }),
            withCredentials: true
        };
    }

    public fetchAllForum(): Observable<any> {
        return this.http.get(`${environment.backendUrl}/forum/fetchAllForums`, this.httpOptions);
    }

    public fetchForum(forumID: string): Observable<any> {
        return this.http.get(`${environment.backendUrl}/forum/fetchForum?forumID=${forumID}`, this.httpOptions);
    }

    public createForum(forum: Forum): Observable<any> {
        console.log(forum);
        return this.http.post(`${environment.backendUrl}/forum/createForum`, forum, this.httpOptions)
    }

    public playerJoin(): Observable<any> {
        return;
        // return this.http.put(`${environment.backendUrl}/forum/playerJoin`, {}, this.httpOptions);
    }

}