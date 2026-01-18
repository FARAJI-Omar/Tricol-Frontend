import { Component } from '@angular/core';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { AuthService } from '../../../core/services/auth-service';
import { Router } from '@angular/router';
import { UserDataService } from '../../../core/services/user-data-service';
import { TokenRefreshService } from '../../../core/services/token-refresh.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './login.html',
})
export class Login {
  loginForm: FormGroup;
  loading = false;
  errorMessage = '';

  constructor(
    private authService: AuthService, 
    private router: Router,
    private userDataService: UserDataService,
    private tokenRefreshService: TokenRefreshService) {
    this.loginForm = new FormGroup({
      username: new FormControl('', Validators.required),
      password: new FormControl('', Validators.required),
      rememberMe: new FormControl(true) // Default to checked
    });
  }

  submit() {
    if (this.loginForm.invalid){
            this.loginForm.markAllAsTouched();
      return;
    };

    this.loading = true;
    this.errorMessage = '';

    this.authService.login(this.loginForm.value).subscribe({
      next: (response) => {
        console.log('Login response:', response);
        
        if (response && response.accessToken) {
          // Save remember me preference
          const rememberMe = this.loginForm.get('rememberMe')?.value ?? true;
          this.userDataService.setRememberMe(rememberMe);
          
          // Save complete user data
          this.userDataService.saveUserData(response);
          
          // Start token refresh timer if remember me is enabled
          if (rememberMe) {
            this.tokenRefreshService.startRefreshTimer();
          }
          
          // Redirect based on role
          this.redirectBasedOnRole(response.role);
        } else {
          this.loading = false;
          this.errorMessage = 'Login failed';
          console.log('Login failed - invalid response:', response);
        }
      },
      error: (err) => {
        this.loading = false;
        // Display backend error message or fallback
        this.errorMessage = err.error?.message || 'Invalid username or password';
      }
    });
  }

  private redirectBasedOnRole(role: string) {
    const roleRoutes: { [key: string]: string } = {
      'ADMIN': '/admin',
      'RESPONSABLE_ACHATS': '/responsableachats',
      'MAGASINIER': '/magasinier',
      'CHEF_ATELIER': '/chefatelier'
    };

    const route = roleRoutes[role] || '/';
    this.router.navigate([route]);
  }
}
