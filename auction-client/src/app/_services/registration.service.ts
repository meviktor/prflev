import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { map } from 'rxjs/internal/operators/map';

@Injectable({
  providedIn: 'root'
})
export class RegistrationService {

    constructor(private http: HttpClient) {}

    register(username: string, email: string, password: string) {
        return this.http.post<any>(`${environment.apiUrl}/register`, {username, password, email})
        .pipe(map(registrationResult => {
            return registrationResult.success;
        }));
    }
}
