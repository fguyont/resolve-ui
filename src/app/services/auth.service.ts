import { Injectable, inject, PLATFORM_ID } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { isPlatformBrowser } from '@angular/common';
import { Observable, tap } from 'rxjs';
import { LoginRequest } from '../dtos/requests/login-request';
import { AuthResponse } from '../dtos/responses/auth-response';
import { RegisterRequest } from '../dtos/requests/register-request';
import { UserInfo } from '../dtos/responses/user-info';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);
  private platformId = inject(PLATFORM_ID);

  private apiUrl = 'http://localhost:5076/api/auth';

  constructor(private router: Router) {}

  login(credentials: LoginRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, credentials).pipe(
      tap(response => {
        if (response && response.token) {
          this.setToken(response.token);
        }
      })
    );
  }

  register(data: RegisterRequest): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, data);
  }

  getCurrentUserInfo(): Observable<UserInfo> {
    return this.http.get<UserInfo>(`${this.apiUrl}/me`);
  }

  logout(): void {
    localStorage.removeItem('authToken'); 
    this.router.navigate(['/login']);
  }

  setToken(token: string): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem('authToken', token);
    }
  }

  getToken(): string | null {
    if (isPlatformBrowser(this.platformId)) {
      const token = localStorage.getItem('authToken');
      return token;
    }
    return null;
  }

  isLoggedIn(): boolean {
    const status = !!this.getToken();
    return status;
  }
}