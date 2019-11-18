import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import createAuth0Client from '@auth0/auth0-spa-js';
import Auth0Client from '@auth0/auth0-spa-js/dist/typings/Auth0Client';
import { BehaviorSubject, combineLatest, from, Observable, of, throwError } from 'rxjs';
import { catchError, concatMap, shareReplay, tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private auth0Client$ = (from(
    createAuth0Client({
      domain: environment.auth0Domain,
      client_id: environment.auth0ClientId,
      audience: 'https://cats-api.demo.com',
      redirect_uri: `${window.location.origin}/callback`,
    }),
  ) as Observable<Auth0Client>).pipe(
    shareReplay(1),
    catchError(err => throwError(err)),
  );

  private userProfileSubject$ = new BehaviorSubject<any>(null);

  readonly userProfile$ = this.userProfileSubject$.asObservable();

  readonly isAuthenticated$ = this.auth0Client$.pipe(
    concatMap((client: Auth0Client) => from(client.isAuthenticated())),
    tap(isAuthenticated => (this.isLoggedIn = isAuthenticated)),
  );

  isLoggedIn: boolean = null;
  isAdmin = false;

  private handleRedirectCallback$ = this.auth0Client$.pipe(
    concatMap((client: Auth0Client) => from(client.handleRedirectCallback())),
  );

  constructor(private router: Router) {}

  getUser$(options?): Observable<any> {
    return this.auth0Client$.pipe(
      concatMap((client: Auth0Client) => from(client.getUser(options))),
      tap(user => {
        this.userProfileSubject$.next(user);
        this.isAdmin = user[`https://cats-api.demo.com/roles`].includes(
          'Admin',
        );
      }),
    );
  }

  getTokenSilently$(options?): Observable<string> {
    return this.auth0Client$.pipe(
      concatMap((client: Auth0Client) =>
        from(client.getTokenSilently(options)),
      ),
    );
  }

  localAuthSetup() {
    const checkAuth$ = this.isAuthenticated$.pipe(
      concatMap(isLoggedIn => (isLoggedIn ? this.getUser$() : of(isLoggedIn))),
    );

    checkAuth$.subscribe((response: { [key: string]: any } | boolean) => {
      this.isLoggedIn = !!response;
    });
  }

  login(redirectPath = '/') {
    this.auth0Client$.subscribe((client: Auth0Client) => {
      client.loginWithRedirect({
        redirect_uri: `${window.location.origin}/callback`,
        appState: { target: redirectPath },
      });
    });
  }

  handleAuthCallback() {
    let targetRoute: string;

    const authComplete$ = this.handleRedirectCallback$.pipe(
      tap(cbRes => {
        targetRoute =
          cbRes.appState && cbRes.appState.target ? cbRes.appState.target : '/';
      }),
      concatMap(() => combineLatest(this.getUser$(), this.isAuthenticated$)),
    );

    authComplete$.subscribe(() => {
      this.router.navigate([targetRoute]);
    });
  }

  logout() {
    this.auth0Client$.subscribe((client: Auth0Client) => {
      client.logout({
        client_id: environment.auth0ClientId,
        returnTo: `${window.location.origin}`,
      });
    });
  }
}
