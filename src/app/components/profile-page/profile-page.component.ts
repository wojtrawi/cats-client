import { Component } from '@angular/core';

import { AuthService } from '../../auth';

@Component({
  selector: 'app-profile-page',
  templateUrl: './profile-page.component.html',
})
export class ProfilePageComponent {
  readonly userProfile$ = this.authService.userProfile$;

  constructor(private authService: AuthService) {}
}
