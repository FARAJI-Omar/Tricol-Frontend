import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { LoginResponse } from '../models/auth.model';
import { Permission } from '../models/user.model';

@Injectable({
  providedIn: 'root',
})
export class UserDataService {
  constructor(private router: Router) {}

  saveToken(token: string) {
    localStorage.setItem('access_token', token);
  }

  getToken(): string | null {
    return localStorage.getItem('access_token');
  }

  getRefreshToken(): string | null {
    const userData = this.getUserData();
    return userData ? userData.refreshToken : null;
  }

  saveTokenExpiry(expiresInMinutes: number = 30) {
    const expiryTime = new Date().getTime() + expiresInMinutes * 60 * 1000;
    localStorage.setItem('token_expiry', expiryTime.toString());
  }

  getTokenExpiry(): number | null {
    const expiry = localStorage.getItem('token_expiry');
    return expiry ? parseInt(expiry, 10) : null;
  }

  isTokenExpired(): boolean {
    const expiry = this.getTokenExpiry();
    if (!expiry) return true;
    return new Date().getTime() >= expiry;
  }

  saveUserData(userData: LoginResponse) {
    localStorage.setItem('user_data', JSON.stringify(userData));
    this.saveToken(userData.accessToken);
    this.saveTokenExpiry(30); // 30 minutes expiry
  }

  getUserData(): LoginResponse | null {
    const data = localStorage.getItem('user_data');
    return data ? JSON.parse(data) : null;
  }

  getRole(): string | null {
    const userData = this.getUserData();
    return userData ? userData.role : null;
  }

  clearToken() {
    localStorage.removeItem('access_token');
    localStorage.removeItem('user_data');
    localStorage.removeItem('token_expiry');
    localStorage.removeItem('remember_me');
  }

  isLoggedIn(): boolean {
    return this.getToken() !== null;
  }

  logout(): void {
    this.clearToken();
    this.router.navigate(['/login']);
  }

  getRememberMe(): boolean {
    return localStorage.getItem('remember_me') === 'true';
  }

  setRememberMe(value: boolean) {
    localStorage.setItem('remember_me', value.toString());
  }
}
