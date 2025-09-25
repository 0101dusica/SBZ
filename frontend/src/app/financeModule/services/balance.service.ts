import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environment';

export interface UserBalance {
  total_income: string;
  total_expenses: string;
  available_balance: string;
  active_budgets_total: string;
  unallocated_funds: string;
}

@Injectable({
  providedIn: 'root'
})
export class BalanceService {
  private readonly baseUrl = `${environment.apiBaseUrl}/balance`;

  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('jwt_token');
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
  }

  getUserBalance(): Observable<UserBalance> {
    return this.http.get<UserBalance>(this.baseUrl, { 
      headers: this.getHeaders() 
    });
  }

  getAvailableBalance(): Observable<{ available_balance: string }> {
    return this.http.get<{ available_balance: string }>(`${this.baseUrl}/available`, { 
      headers: this.getHeaders() 
    });
  }
}