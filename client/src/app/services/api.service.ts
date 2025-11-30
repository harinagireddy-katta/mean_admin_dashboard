import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private baseUrl = 'http://localhost:3000/api';

  constructor(private http: HttpClient, private authService: AuthService) { }

  private getHeaders() {
    const token = this.authService.getToken();
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }

  getAnalytics() {
    return this.http.get(`${this.baseUrl}/analytics`, { headers: this.getHeaders() });
  }

  getUsers() {
    return this.http.get(`${this.baseUrl}/users`, { headers: this.getHeaders() });
  }

  deleteUser(id: string) {
    return this.http.delete(`${this.baseUrl}/users/${id}`, { headers: this.getHeaders() });
  }

  generateUser() {
    return this.http.post(`${this.baseUrl}/users/generate`, {}, { headers: this.getHeaders() });
  }

  getContent() {
    return this.http.get(`${this.baseUrl}/content`, { headers: this.getHeaders() });
  }

  createContent(data: any) {
    return this.http.post(`${this.baseUrl}/content`, data, { headers: this.getHeaders() });
  }

  deleteContent(id: string) {
    return this.http.delete(`${this.baseUrl}/content/${id}`, { headers: this.getHeaders() });
  }

  recordSale() {
    return this.http.post(`${this.baseUrl}/analytics/sale`, { amount: 100 }, { headers: this.getHeaders() });
  }

  recordTraffic() {
    return this.http.post(`${this.baseUrl}/analytics/traffic`, { page: 'dashboard' }, { headers: this.getHeaders() });
  }
}
