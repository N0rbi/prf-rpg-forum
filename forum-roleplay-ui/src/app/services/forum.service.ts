import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Forum } from '../models/forum.interface';

@Injectable({
    providedIn: 'root'
})

export class ForumService {

    private forumSource: BehaviorSubject<any> = new BehaviorSubject(null);
    forumStore = this.forumSource.asObservable();

    httpOptions = {};

    constructor(private http: HttpClient) {
        this.httpOptions = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json'
            }),
            withCredentials: true
        };
    }

    public updateForumStore(newForum): void {
        this.forumSource.next(newForum);
    }

    public fetchAllForum(): Observable<any> {
        return this.http.get(`${environment.backendUrl}/forum/fetchAllForums`, this.httpOptions);
    }

    public fetchForum(forumID: string): Observable<any> {
        return this.http.get(`${environment.backendUrl}/forum/fetchForum?forumID=${forumID}`, this.httpOptions);
    }

    public createForum(forum: Forum): Observable<any> {
        return this.http.post(`${environment.backendUrl}/forum/createForum`, forum, this.httpOptions)
    }

    public joinGame(playerData): Observable<any> {
        return this.http.put(`${environment.backendUrl}/forum/playerJoin`, playerData, this.httpOptions);
    }

}