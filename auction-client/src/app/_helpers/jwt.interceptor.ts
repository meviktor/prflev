import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {
    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        let accessToken = localStorage.getItem('accessToken');
        if (accessToken) {
            req = req.clone({
                setHeaders: { 
                    Authorization: `Bearer ${accessToken}`
                }
            });
        }

        return next.handle(req);
    }
}