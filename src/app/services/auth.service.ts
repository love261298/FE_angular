import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { jwtDecode } from 'jwt-decode';
import { environment } from '../../environments/environment';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = environment.API_URL;
  private router = inject(Router);
  constructor(private http: HttpClient) {}
  login(credentials: { phone: string; password: string }): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, credentials);
  }
  register(data: {
    phone: string;
    name: string;
    password: string;
    confirmPassword: string;
  }): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, data);
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
      const currentTime = Math.floor(Date.now() / 1000);
      return decoded.exp > currentTime;
    } catch (error) {
      return false;
    }
  }
}
