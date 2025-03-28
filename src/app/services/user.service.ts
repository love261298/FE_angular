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
  getUser(lastId?: string): Observable<any> {
    let url = `${this.apiUrl}/user`;
    if (lastId) {
      url += `?lastId=${lastId}`;
    }
    return this.http.get(url);
  }
  updateUser(id: string, user: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/user/${id}`, user);
  }

  changePassword(passwordForm: any) {
    return this.http.patch(`${this.apiUrl}/user`, passwordForm);
  }

  deleteUser(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/user/${id}`);
  }
}
