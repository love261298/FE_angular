import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(private http: HttpClient) {}
  private apiUrl = environment.API_URL;
  getUser(): Observable<any> {
    return this.http.get(`${this.apiUrl}/user`);
  }
  updateUser(user: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/user/${user.phone}`, user);
  }

  changePassword(passwordForm: any) {
    return this.http.patch(`${this.apiUrl}/user`, passwordForm);
  }

  deleteUser(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/user/${id}`);
  }
}
