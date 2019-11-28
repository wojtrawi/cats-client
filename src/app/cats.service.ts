import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { ToastrService } from 'ngx-toastr';
import { Observable, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

interface Cat {
  _id: string;
  name: string;
}

@Injectable({
  providedIn: 'root',
})
export class CatsService {
  readonly addCat$ = this.socket.fromEvent<string>('addCat');
  readonly newCatAvailable$ = this.socket.fromEvent<void>('newCatAvailable');

  constructor(
    private http: HttpClient,
    private socket: Socket,
    private toastrService: ToastrService,
  ) {}

  getCats(): Observable<Cat[]> {
    return this.http.get<Cat[]>(`${environment.apiUrl}/cats`).pipe(
      catchError(err => {
        this.handleError(err);

        return of([]);
      }),
    );
  }

  addCat(name: string): Observable<Cat> {
    return this.http
      .post<Cat>(`${environment.apiUrl}/cats`, { name })
      .pipe(
        tap(
          cat => {
            this.socket.emit('addCat');
            this.toastrService.success(`Cat ${cat.name} has been added!`);
          },
          err => {
            this.handleError(err);
          },
        ),
      );
  }

  removeCat(id: string): Observable<Cat> {
    return this.http.delete<Cat>(`${environment.apiUrl}/cats/${id}`).pipe(
      tap(
        cat => {
          this.toastrService.success(`Cat ${cat.name} has been removed!`);
        },
        err => {
          this.handleError(err);
        },
      ),
    );
  }

  private handleError(err: HttpErrorResponse) {
    this.toastrService.error(err.message, 'Error');
    console.log(err);
  }
}
