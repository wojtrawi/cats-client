import { Component } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';
import { switchMap } from 'rxjs/operators';

import { CatsService } from '../../cats.service';
import { AuthService } from './../../auth/auth.service';

@Component({
  selector: 'app-cats-page',
  templateUrl: './cats-page.component.html',
  styleUrls: ['./cats-page.component.scss'],
})
export class CatsPageComponent {
  private refreshSubject = new BehaviorSubject<void>(null);

  readonly cats$ = this.refreshSubject.pipe(
    switchMap(() => this.catsService.getCats()),
  );

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

  addCat() {
    this.newCatControl.markAsTouched();

    if (this.newCatControl.valid) {
      this.catsService.addCat(this.newCatControl.value).subscribe(() => {
        this.newCatControl.reset('');
        this.refreshSubject.next();
      });
    }
  }

  removeCat(id: string) {
    this.catsService.removeCat(id).subscribe(() => {
      this.refreshSubject.next();
    });
  }
}
