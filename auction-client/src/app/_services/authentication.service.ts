import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  isAuthenticated: boolean = localStorage.getItem('accessToken') != null;

    constructor(private http: HttpClient) {}

    login(username: string, password: string) {
        return this.http.post<any>(`${environment.apiUrl}/authenticate`, {username, password})
        .pipe(map(
            authResult => {
                if (authResult.success && authResult.accessToken) {
                    localStorage.setItem('accessToken', authResult.accessToken);
                    this.isAuthenticated = true;
                    return true;
                }
                return false;
            }
        ));
    }

    logout() {
        localStorage.removeItem('accessToken');
        this.isAuthenticated = false;
    }
}
