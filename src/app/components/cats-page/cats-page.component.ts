import { Component } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { BehaviorSubject, merge } from 'rxjs';
import { switchMap, tap } from 'rxjs/operators';

import { AuthService } from '../../auth/auth.service';
import { CatsService } from '../../cats.service';

@Component({
  selector: 'app-cats-page',
  templateUrl: './cats-page.component.html',
  styleUrls: ['./cats-page.component.scss'],
})
export class CatsPageComponent {
  private refreshSubject = new BehaviorSubject<void>(null);
  private loadingSubject = new BehaviorSubject<boolean>(true);

  readonly cats$ = merge(
    this.refreshSubject,
    this.catsService.newCatAvailable$,
  ).pipe(
    tap(() => this.loadingSubject.next(true)),
    switchMap(() => this.catsService.getCats()),
    tap(() => this.loadingSubject.next(false)),
  );

  readonly isLoading$ = this.loadingSubject.asObservable();

  newCatControl = new FormControl('', [
    Validators.required,
    Validators.minLength(5),
    Validators.maxLength(50),
  ]);

  constructor(
    private authService: AuthService,
    private catsService: CatsService,
  ) {}

  get isLoggedIn(): boolean {
    return this.authService.isLoggedIn;
  }

  get isAdmin(): boolean {
    return this.authService.isAdmin;
  }

  get hasErrorMessage(): boolean {
    return this.newCatControl.touched && this.newCatControl.invalid;
  }

  addCat() {
    this.newCatControl.markAsTouched();

    if (this.newCatControl.valid) {
      this.catsService.addCat(this.newCatControl.value).subscribe(() => {
        this.newCatControl.reset('');
      });
    }
  }

  removeCat(id: string) {
    this.catsService.removeCat(id).subscribe(() => {
      this.refreshSubject.next();
    });
  }
}
