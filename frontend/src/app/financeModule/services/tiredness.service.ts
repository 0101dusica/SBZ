import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environment';

export interface ActivityEvent {
  id?: number;
  sessionId: number;
  activityType: 'WORK' | 'ENTERTAINMENT';
  deviceType: 'COMPUTING_DEVICE' | 'PHONE_DEVICE';
  startTimestamp: number;
  endTimestamp: number;
  activityDuration: number;
  breakDuration: number;
  typingSpeed: number;
  errors: number;
  category: string;
  mouseMovements: number;
}

export interface Session {
  sessionId: number;
  userId: number;
  startTimestamp: number;
  endTimestamp: number;
  subjectiveTirednessLevel: number;
  risks: string[];
  riskLevel: number;
  activityEvents: ActivityEvent[];
}

export interface SessionDTO {
  sessions: Session[];
}

export interface Recommendation {
  sessionId: number;
  message: string;
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
}

export interface CreateActivityEventRequest {
  id: number;
  sessionId: number;
  activityType: 'WORK' | 'ENTERTAINMENT';
  deviceType: 'COMPUTING_DEVICE' | 'PHONE_DEVICE';
  startTimestamp: number;
  endTimestamp: number;
  activityDuration: number;
  breakDuration?: number;
  typingSpeed: number;
  errors: number;
}

@Injectable({
  providedIn: 'root'
})
export class TirednessService {
  private apiUrl = `${environment.apiUrl}/api/tiredness-system`;

  constructor(private http: HttpClient) { }

  // Initialize sessions in memory
  initSession(sessionDTO: SessionDTO): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/init-session`, sessionDTO);
  }

  // Add new event to session
  addEvent(event: CreateActivityEventRequest): Observable<Recommendation[]> {
    const activityEvent: ActivityEvent = {
      id: event.id,
      sessionId: event.sessionId,
      activityType: event.activityType,
      deviceType: event.deviceType,
      startTimestamp: event.startTimestamp,
      endTimestamp: event.endTimestamp,
      activityDuration: event.activityDuration,
      breakDuration: event.breakDuration || 0,
      typingSpeed: event.typingSpeed,
      errors: event.errors,
      category: event.activityType,
      mouseMovements: 0
    };

    return this.http.post<Recommendation[]>(`${this.apiUrl}/add-event`, activityEvent);
  }

  // Get current session
  getCurrentSession(sessionId: number): Observable<SessionDTO> {
    return this.http.get<SessionDTO>(`${this.apiUrl}/current-session/${sessionId}`);
  }

  // Get recommendations for session
  getRecommendationsForSession(sessionId: number): Observable<Recommendation[]> {
    return this.http.get<Recommendation[]>(`${this.apiUrl}/recommendations/${sessionId}`);
  }

  // Get recommendations for user
  getRecommendationsForUser(userId: number): Observable<Recommendation[]> {
    return this.http.get<Recommendation[]>(`${this.apiUrl}/recommendations/user/${userId}`);
  }

  // Submit tiredness level
  submitTirednessLevel(sessionId: number, level: number): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/submit-tiredness-level/${sessionId}`, level);
  }

  // End session
  endSession(): Observable<string> {
    return this.http.post(`${this.apiUrl}/end-session`, {}, { responseType: 'text' });
  }

  // Get activities for session
  getActivitiesForSession(sessionId: number): Observable<ActivityEvent[]> {
    return this.http.get<ActivityEvent[]>(`${this.apiUrl}/activities/${sessionId}`);
  }
}