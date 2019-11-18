import { Injectable } from '@angular/core';
import { CanActivate, RouterStateSnapshot } from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError, switchMap, tap } from 'rxjs/operators';

import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService) {}

  canActivate(_, { url }: RouterStateSnapshot): Observable<boolean> {
    return this.authService.getTokenSilently$().pipe(
      switchMap(() => this.authService.isAuthenticated$),
      catchError(() => of(false)),
      tap(isLoggedIn => {
        if (!isLoggedIn) {
          this.authService.login(url);
        }
      }),
    );
  }
}
