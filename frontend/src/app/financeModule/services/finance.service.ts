import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environment';

export interface Income {
  id: string;
  description: string;
  amount: number;
  user_id: string;
  category_id?: string;
  date: string;
  created_at: string;
  updated_at: string;
}

export interface Expense {
  id: string;
  description: string;
  amount: number;
  user_id: string;
  category_id?: string;
  date: string;
  is_recurring: boolean;
  recurring_period?: string;
  next_run?: string;
  created_at: string;
  updated_at: string;
}

export interface CreateIncomeRequest {
  description: string;
  amount: number;
  category_id?: string;
  date: string;
}

export interface CreateExpenseRequest {
  description: string;
  amount: number;
  category_id?: string;
  date: string;
  is_recurring?: boolean;
  recurring_period?: string;
}

@Injectable({
  providedIn: 'root'
})
export class FinanceService {
  private apiUrl = environment.apiBaseUrl;

  constructor(private http: HttpClient) {}

  // Income methods
  getIncomes(): Observable<Income[]> {
    return this.http.get<Income[]>(`${this.apiUrl}/incomes`);
  }

  createIncome(income: CreateIncomeRequest): Observable<Income> {
    return this.http.post<Income>(`${this.apiUrl}/incomes`, income);
  }

  deleteIncome(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/incomes/${id}`);
  }

  // Expense methods
  getExpenses(): Observable<Expense[]> {
    return this.http.get<Expense[]>(`${this.apiUrl}/expenses`);
  }

  createExpense(expense: CreateExpenseRequest): Observable<Expense> {
    return this.http.post<Expense>(`${this.apiUrl}/expenses`, expense);
  }

  deleteExpense(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/expenses/${id}`);
  }
}