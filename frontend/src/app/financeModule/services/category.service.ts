import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../../environment';

export interface Category {
  id: string;
  created_by_user_id?: string;
  name: string;
  category_type: string; // "income" or "expense"
  created_at: string;
  updated_at: string;
}

export interface CreateCategoryRequest {
  name: string;
  category_type: string; // "income" or "expense"
}

export interface UpdateCategoryRequest {
  name?: string;
  category_type?: string;
}

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  private apiUrl = `${environment.apiBaseUrl}/categories`;

  constructor(private http: HttpClient) {}

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('jwt_token');
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }

  private handleError(error: any): Observable<never> {
    console.error('Category API Error:', error);
    return throwError(() => error);
  }

  getCategories(categoryType?: 'income' | 'expense'): Observable<Category[]> {
    let url = this.apiUrl;
    if (categoryType) {
      url += `?category_type=${categoryType}`;
    }
    return this.http.get<Category[]>(url, { 
      headers: this.getAuthHeaders()
    }).pipe(
      catchError(this.handleError)
    );
  }

  getCategoryById(id: string): Observable<Category> {
    return this.http.get<Category>(`${this.apiUrl}/${id}`, { 
      headers: this.getAuthHeaders() 
    }).pipe(
      catchError(this.handleError)
    );
  }

  createCategory(category: CreateCategoryRequest): Observable<Category> {
    return this.http.post<Category>(this.apiUrl, category, { 
      headers: this.getAuthHeaders() 
    }).pipe(
      catchError(this.handleError)
    );
  }

  findOrCreateCategory(category: CreateCategoryRequest): Observable<Category> {
    return this.http.post<Category>(`${this.apiUrl}/find-or-create`, category, { 
      headers: this.getAuthHeaders() 
    }).pipe(
      catchError(this.handleError)
    );
  }

  updateCategory(id: string, category: UpdateCategoryRequest): Observable<Category> {
    return this.http.put<Category>(`${this.apiUrl}/${id}`, category, { 
      headers: this.getAuthHeaders() 
    }).pipe(
      catchError(this.handleError)
    );
  }

  deleteCategory(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`, { 
      headers: this.getAuthHeaders() 
    }).pipe(
      catchError(this.handleError)
    );
  }

  // Helper method to get default categories
  getDefaultExpenseCategories(): string[] {
    return ['Food', 'Shopping', 'Transportation', 'Entertainment'];
  }

  getDefaultIncomeCategories(): string[] {
    return ['Salary', 'Freelance', 'Investment', 'Other'];
  }
}