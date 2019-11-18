import { Component } from '@angular/core';

import { AuthService } from '../../auth';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
})
export class NavbarComponent {
  constructor(private authService: AuthService) {}

  get isLoggedIn(): boolean {
    return this.authService.isLoggedIn;
  }

  login() {
    this.authService.login();
  }

  logout() {
    this.authService.logout();
  }
}
