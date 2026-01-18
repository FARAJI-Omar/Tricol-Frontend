import { Component } from '@angular/core';
import { UserDataService } from '../../../core/services/user-data-service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  imports: [],
  templateUrl: './header.html',
})
export class Header {
  constructor(
    private userDataService: UserDataService,
    private router: Router
  ) {}

  isLoggedIn(): boolean {
    return this.userDataService.isLoggedIn();
  }

  getUsername(): string | null {
    const userData = this.userDataService.getUserData();
    return userData ? userData.username : null;
  }
  logout() {
    this.userDataService.clearToken();
    this.router.navigate(['/login']);
  }
}
