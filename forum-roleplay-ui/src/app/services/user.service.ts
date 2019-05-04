import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
@Injectable({
    providedIn: 'root'
})

export class UserService {
    constructor(private http: HttpClient) {}

    public registration(user: User) {
        const httpOptions = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json'
            }),
        };
        return this.http.post(`${environment.backendUrl}/auth/signup`, {
            username: user.username,
            password: user.password
        }, httpOptions);
    }

    public isAuthenticated() {
        return this.http.get(`${environment.backendUrl}/auth/isAuthenticated`, {withCredentials: true});
    }

    public login(user: User): Observable<any> {
        const httpOptions = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json'
            }),
            withCredentials: true
        };
        return this.http.post(`${environment.backendUrl}/auth/login`, {
            username: user.username,
            password: user.password
        }, httpOptions);
    }

    public logout() {
        const httpOptions = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json'
            }),
            withCredentials: true
        };
        return this.http.post(`${environment.backendUrl}/auth/logout`, {}, httpOptions);
    }

    public fetchUser(username: string) {
        return this.http.get(`${environment.backendUrl}/auth/fetchUser?username=${username}`, {withCredentials: true});
    }

    public fetchAuthenticatedUser() {
        return this.http.get(`${environment.backendUrl}/auth/fetchAuthenticatedUser`, {withCredentials: true});
    }
}

interface User {
    username: string;
    password: string;
}