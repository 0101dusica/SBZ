import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Template {
  id: number;
  userId: number;
  name: string;
  
  // WORK pragovi (u minutima)
  workLowThreshold: number;        // Početak LOW upozorenja za rad
  workMediumThreshold: number;     // Početak MEDIUM upozorenja za rad
  workHighThreshold: number;       // Početak HIGH upozorenja za rad
  
  // ENTERTAINMENT pragovi (u minutima)
  entertainmentLowThreshold: number;    // Početak LOW upozorenja za zabavu
  entertainmentMediumThreshold: number; // Početak MEDIUM upozorenja za zabavu
  entertainmentHighThreshold: number;   // Početak HIGH upozorenja za zabavu
  
  // Dodatni pragovi
  focusDropThreshold: number;      // Pad koncentracije (procenat)
  errorRateThreshold: number;      // Povećanje grešaka (procenat)
  
  // CEP pragovi
  noBreakStreakMinutes: number;
  appSwitchCount: number;
  passiveBingeMinutes: number;
  
  // Akcije po nivoima umora (1-3) - simplified
  enableLowAction: boolean;        // Nivo 1: Blagi umor
  enableMediumAction: boolean;     // Nivo 2: Umeren umor
  enableHighAction: boolean;       // Nivo 3: Visok umor
  
  // Integracija uređaja
  combineDevices: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class TemplateService {
  private baseUrl = 'http://localhost:8080/api/templates';

  constructor(private http: HttpClient) { }

  getUserTemplate(userId: number): Observable<Template> {
    return this.http.get<Template>(`${this.baseUrl}/user/${userId}`);
  }

  saveUserTemplate(userId: number, template: Template): Observable<Template> {
    return this.http.post<Template>(`${this.baseUrl}/user/${userId}`, template);
  }

  getDefaultTemplate(): Observable<Template> {
    return this.http.get<Template>(`${this.baseUrl}/default`);
  }

  resetToDefault(userId: number): Observable<Template> {
    return this.http.post<Template>(`${this.baseUrl}/user/${userId}/reset`, {});
  }

  hasCustomTemplate(userId: number): Observable<boolean> {
    return this.http.get<boolean>(`${this.baseUrl}/user/${userId}/has-custom`);
  }

  // Nova funkcionalnost - generisanje dinamičkih pravila
  generateDynamicRules(userId: number): Observable<string> {
    return this.http.get(`${this.baseUrl}/user/${userId}/generate-rules`, { responseType: 'text' });
  }
}