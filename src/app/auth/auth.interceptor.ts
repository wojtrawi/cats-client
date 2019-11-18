import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';

import { AuthService } from './auth.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private authService: AuthService) {}

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler,
  ): Observable<HttpEvent<any>> {
    return this.authService.getTokenSilently$().pipe(
      catchError(() => of('')),
      switchMap(accessToken => {
        const authReq = req.clone({
          setHeaders: { Authorization: `Bearer ${accessToken}` },
        });

        return next.handle(authReq).pipe(
          catchError((err: HttpErrorResponse) => {
            if (err.status === 401) {
              this.authService.login();
            }

            return throwError(err);
          }),
        );
      }),
    );
  }
}
