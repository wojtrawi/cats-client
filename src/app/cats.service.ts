import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

interface Cat {
  _id: string;
  name: string;
}

@Injectable({
  providedIn: 'root',
})
export class CatsService {
  constructor(private http: HttpClient) {}

  getCats(): Observable<Cat[]> {
    return this.http.get<Cat[]>(`${environment.apiUrl}/cats`);
  }

  addCat(name: string): Observable<Cat> {
    return this.http.post<Cat>(`${environment.apiUrl}/cats`, { name });
  }

  removeCat(id: string): Observable<Cat> {
    return this.http.delete<Cat>(`${environment.apiUrl}/cats/${id}`);
  }
}
