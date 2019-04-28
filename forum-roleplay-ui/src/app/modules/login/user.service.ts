import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
@Injectable({
    providedIn: 'root'
})

export class UserService {
    constructor(private http: HttpClient) {}

    public registration(user) {
        return this.http.post(`${environment.backendUrl}/auth/signup`, {
            username: user.username,
            password: user.password
        });
    }

    public isAuthenticated() {
        return this.http.get(`${environment.backendUrl}/auth/isAuthenticated`);
    }

    public login(user) {
        return this.http.post(`${environment.backendUrl}/auth/login`, {
            username: user.username,
            password: user.password
        });
    }

    public logout(user) {
        return this.http.post(`${environment.backendUrl}/auth/logout`, {
            username: user.username,
            password: user.password
        });
    }
}
