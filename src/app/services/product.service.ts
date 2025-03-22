import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  constructor(private http: HttpClient) {}
  private apiUrl = environment.API_URL;
  getProducts(): Observable<any> {
    return this.http.get(`${this.apiUrl}/product`);
  }
  getProductById(id: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/product/${id}`);
  }
  createProduct(productData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/product/`, productData);
  }
  update(id: string, productData: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/product/${id}`, productData);
  }

  deleteProduct(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/product/${id}`);
  }
}
