import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { jwtDecode } from 'jwt-decode';
import { environment } from '../../environments/environment';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = environment.API_URL;
  private http = inject(HttpClient);
  private router = inject(Router);

  login(credentials: { phone: string; password: string }): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, credentials).pipe(
      catchError((error) => {
        console.error('Login error:', error);
        return throwError(() => new Error('Login failed'));
      })
    );
  }

  register(data: {
    phone: string;
    name: string;
    password: string;
    confirmPassword: string;
  }): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, data).pipe(
      catchError((error) => {
        console.error('Registration error:', error);
        return throwError(() => new Error('Registration failed'));
      })
    );
  }

  saveToken(token: string): void {
    localStorage.setItem('jwt_token', token);
  }

  getToken(): string | null {
    return localStorage.getItem('jwt_token');
  }

  logout(): void {
    localStorage.removeItem('jwt_token');
    this.router.navigate(['/login']);
  }

  isAuthenticated(): boolean {
    const token = this.getToken();
    if (!token) return false;
    try {
      const decoded: any = jwtDecode(token);
      return decoded.exp > Math.floor(Date.now() / 1000);
    } catch (err) {
      console.error('Token decoding error:', err);
      return false;
    }
  }

  getUserInfo(): any {
    const token = this.getToken();
    if (!token) return null;
    try {
      return jwtDecode(token);
    } catch (err) {
      console.error('Invalid token:', err);
      return null;
    }
  }
}
