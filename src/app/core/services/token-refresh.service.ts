import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';
import { interval, Subject, switchMap, takeUntil, catchError, of, filter } from 'rxjs';
import { AuthService } from './auth-service';
import { UserDataService } from './user-data-service';

@Injectable({
  providedIn: 'root',
})
export class TokenRefreshService {
  private destroy$ = new Subject<void>();
  private isRefreshing = false;
  private authService = inject(AuthService);
  private userDataService = inject(UserDataService);
  private router = inject(Router);

  constructor() {
    // Auto-start refresh timer if user is logged in and remember me is enabled
    this.initializeRefreshTimer();
  }

  /**
   * Initialize refresh timer - checks every minute if token needs refresh
   * Refresh happens at 25 minutes (5 minutes before 30-minute expiry)
   */
  private initializeRefreshTimer() {
    if (this.userDataService.isLoggedIn() && this.userDataService.getRememberMe()) {
      this.startRefreshTimer();
    }
  }

  /**
   * Start the background token refresh timer
   */
  startRefreshTimer() {
    // Stop any existing timer
    this.stopRefreshTimer();

    // Check every minute if token needs refresh
    interval(60000) // 60 seconds = 1 minute
      .pipe(
        takeUntil(this.destroy$),
        filter(() => this.shouldRefreshToken()),
        switchMap(() => this.refreshToken())
      )
      .subscribe();
  }

  /**
   * Stop the refresh timer
   */
  stopRefreshTimer() {
    this.destroy$.next();
  }

  /**
   * Check if token should be refreshed
   * Returns true if token expires in less than 5 minutes
   */
  private shouldRefreshToken(): boolean {
    const expiry = this.userDataService.getTokenExpiry();
    if (!expiry) return false;

    const now = new Date().getTime();
    const timeUntilExpiry = expiry - now;
    const fiveMinutes = 5 * 60 * 1000; // 5 minutes in milliseconds

    // Refresh if less than 5 minutes until expiry
    return timeUntilExpiry <= fiveMinutes && timeUntilExpiry > 0;
  }

  /**
   * Refresh the access token using the refresh token
   */
  refreshToken() {
    if (this.isRefreshing) {
      return of(null);
    }

    const refreshToken = this.userDataService.getRefreshToken();
    if (!refreshToken) {
      this.handleRefreshFailure();
      return of(null);
    }

    this.isRefreshing = true;

    return this.authService.refresh(refreshToken).pipe(
      catchError((error) => {
        console.error('Token refresh failed:', error);
        this.handleRefreshFailure();
        return of(null);
      }),
      switchMap((response) => {
        this.isRefreshing = false;
        if (response && response.accessToken) {
          // Update tokens and expiry
          this.userDataService.saveUserData(response);
          console.log('Token refreshed successfully');
        } else {
          this.handleRefreshFailure();
        }
        return of(response);
      })
    );
  }

  /**
   * Handle token refresh failure by logging out the user
   */
  private handleRefreshFailure() {
    this.isRefreshing = false;
    this.stopRefreshTimer();
    this.userDataService.logout();
  }

  /**
   * Clean up on service destruction
   */
  ngOnDestroy() {
    this.stopRefreshTimer();
  }
}
