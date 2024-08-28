import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpErrorResponse, HttpEvent } from '@angular/common/http';
import { Observable, throwError, from } from 'rxjs';
import { catchError, switchMap, tap } from 'rxjs/operators';
import { AuthService } from './services/auth.service';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {

  constructor(private authService: AuthService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(this.addAuthHeader(req)).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401) {
          return this.authService.refresh().pipe(
            switchMap(() => {
              return next.handle(this.addAuthHeader(req));
            }),
            catchError(err => {
              this.authService.redirectToLogin();
              return throwError(err);
            })
          );
        } else {
          return throwError(error);
        }
      })
    );
  }

  private addAuthHeader(req: HttpRequest<any>): HttpRequest<any> {
    const token = this.authService.getToken(); 
    return req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
  }
}
