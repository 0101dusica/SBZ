// ...existing imports and interfaces...
// (remove this duplicate class declaration)
import { Component, OnInit, AfterViewInit, ViewChild, ElementRef, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ButtonComponent } from '../../sharedModule/button/button.component';
import { InputFieldComponent } from '../../sharedModule/input-field/input-field.component';
import { TirednessService, Session, SessionDTO, ActivityEvent, Recommendation, CreateActivityEventRequest } from '../services/tiredness.service';
import { Chart, ChartConfiguration } from 'chart.js/auto';
import { SimpleTemplateSettingsComponent } from '../components/simple-template-settings/simple-template-settings.component';
import { TemplateService, Template } from '../services/template.service';

interface TimeData {
  totalTime: { hours: number, minutes: number };
  workTime: { hours: number, minutes: number };
  entertainmentTime: { hours: number, minutes: number };
}

interface ActivityForm {
  activityType: 'WORK' | 'ENTERTAINMENT' | '';
  deviceType: 'COMPUTING_DEVICE' | 'PHONE_DEVICE' | '';
  startTime: string;
  activityDuration: number | null;
  breakDuration: number | null;
  typingSpeed: number | null;
  errors: number | null;
}

@Component({
  selector: 'app-tiredness-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, ButtonComponent, InputFieldComponent, SimpleTemplateSettingsComponent],
  template: `
    <div class="tiredness-dashboard">
      <!-- Header with Logo -->
      <div class="header">
        <div class="logo-section">
          <img src="logo/logo-text.png" alt="Digital Care Logo" class="logo"/>
        </div>
        <div class="header-actions" style="margin-left:auto;">
          <button class="settings-btn" (click)="openSettings()" title="Postavke">
            <svg width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 15.5A3.5 3.5 0 0 1 8.5 12A3.5 3.5 0 0 1 12 8.5a3.5 3.5 0 0 1 3.5 3.5a3.5 3.5 0 0 1-3.5 3.5m7.43-2.53c.04-.32.07-.64.07-.97c0-.33-.03-.66-.07-1l2.11-1.63c.19-.15.24-.42.12-.64l-2-3.46c-.12-.22-.39-.31-.61-.22l-2.49 1c-.52-.39-1.06-.73-1.69-.98l-.37-2.65A.506.506 0 0 0 14 2h-4c-.25 0-.46.18-.5.42l-.37 2.65c-.63.25-1.17.59-1.69.98l-2.49-1c-.22-.09-.49 0-.61.22l-2 3.46c-.13.22-.07.49.12.64L4.57 11c-.04.34-.07.67-.07 1c0 .33.03.65.07.97l-2.11 1.66c-.19.15-.25.42-.12.64l2 3.46c.12.22.39.3.61.22l2.49-1.01c.52.4 1.06.74 1.69.99l.37 2.65c.04.24.25.42.5.42h4c.25 0 .46-.18.5-.42l.37-2.65c.63-.26 1.17-.59 1.69-.99l2.49 1.01c.22.08.49 0 .61-.22l2-3.46c.12-.22.07-.49-.12-.64l-2.11-1.66Z"/>
            </svg>
          </button>
        </div>
      </div>

      <!-- Main Content -->
      <div class="dashboard-content">
        <!-- Left Section -->
        <div class="left-section">
          <!-- Time Overview -->
          <div class="time-overview-card">
            <h2>Rad/Mreža</h2>
            <div class="total-time">
              <span class="time">{{ timeData.totalTime.hours }}h {{ timeData.totalTime.minutes }}min</span>
              <p class="label">Provedeno vreme kod kuće</p>
            </div>
            <div class="time-breakdown">
              <div class="time-item">
                <span class="label">Rad</span>
                <span class="value">{{ timeData.workTime.hours }}h {{ timeData.workTime.minutes }}min</span>
              </div>
              <div class="time-item">
                <span class="label">Zabava</span>
                <span class="value">{{ timeData.entertainmentTime.hours }}h {{ timeData.entertainmentTime.minutes }}min</span>
              </div>
            </div>
            
            <!-- Session Control Button -->
            <div class="session-control-center">
              <app-button 
                *ngIf="!isSessionActive"
                (click)="startSession()"
                [disabled]="isStartingSession"
                [label]="isStartingSession ? 'Pokretanje...' : 'Pokreni sesiju'"
                class="wide-btn">
              </app-button>
              <app-button 
                *ngIf="isSessionActive"
                (click)="startNewSession()"
                [disabled]="isStartingSession"
                variant="outline"
                [label]="isStartingSession ? 'Pokretanje...' : 'Pokreni novu sesiju'"
                class="wide-btn">
              </app-button>
            </div>

            <!-- Simulation Control -->
            <div style="display: flex; align-items: center; gap: 0.5rem; margin-top: 1rem;">
              <select [(ngModel)]="selectedSimulation" style="flex: 1; padding: 0.5rem; border-radius: 6px; border: 1px solid var(--border-light);">
                <option [ngValue]="null" disabled selected>Izaberi simulaciju</option>
                <option *ngFor="let sim of simulationFiles" [ngValue]="sim.value">{{ sim.label }}</option>
              </select>
              <app-button 
                (click)="runSimulation()" 
                [label]="'Pokreni simulaciju'" 
                [disabled]="!selectedSimulation"
                variant="outline"
                style="white-space: nowrap;">
              </app-button>
            </div>
          </div>

          <!-- Tiredness Level Input -->
          <div class="tiredness-level-card">
            <h3>Oceni nivo umora (1-5)</h3>
            <div class="level-buttons">
              <button 
                *ngFor="let level of [1,2,3,4,5]" 
                class="level-btn"
                [class.active]="selectedTirednessLevel === level"
                [disabled]="!isSessionActive"
                (click)="selectTirednessLevel(level)">
                {{ level }}
              </button>
            </div>
            <div class="button-center">
              <app-button 
                (click)="submitTirednessLevel()"
                [disabled]="!selectedTirednessLevel || isSubmittingLevel || !isSessionActive"
                [label]="isSubmittingLevel ? 'Šalje...' : 'Potvrdi'"
                class="wide-btn">
              </app-button>
            </div>
          </div>

          <!-- Activity Input Form -->
          <div class="activity-form-card">
            <h3>Dodaj aktivnost</h3>
            
            <!-- Activity Type Toggle -->
            <div class="form-group">
              <label>Tip aktivnosti</label>
              <div class="toggle-buttons">
                <button 
                  type="button"
                  class="toggle-btn"
                  [class.active]="newActivity.activityType === 'WORK'"
                  [disabled]="!isSessionActive"
                  (click)="newActivity.activityType = 'WORK'">
                  Rad
                </button>
                <button 
                  type="button"
                  class="toggle-btn"
                  [class.active]="newActivity.activityType === 'ENTERTAINMENT'"
                  [disabled]="!isSessionActive"
                  (click)="newActivity.activityType = 'ENTERTAINMENT'">
                  Zabava
                </button>
              </div>
            </div>

            <!-- Device Type Toggle -->
            <div class="form-group">
              <label>Uređaj</label>
              <div class="toggle-buttons">
                <button 
                  type="button"
                  class="toggle-btn"
                  [class.active]="newActivity.deviceType === 'COMPUTING_DEVICE'"
                  [disabled]="!isSessionActive"
                  (click)="newActivity.deviceType = 'COMPUTING_DEVICE'">
                  Računar
                </button>
                <button 
                  type="button"
                  class="toggle-btn"
                  [class.active]="newActivity.deviceType === 'PHONE_DEVICE'"
                  [disabled]="!isSessionActive"
                  (click)="newActivity.deviceType = 'PHONE_DEVICE'">
                  Telefon
                </button>
              </div>
            </div>

            <!-- Start Time -->
            <div class="form-group">
              <app-input-field
                label="Vreme početka"
                type="datetime-local"
                [(ngModel)]="newActivity.startTime"
                [disabled]="!isSessionActive">
              </app-input-field>
            </div>

            <!-- Duration Fields -->
            <div class="form-row">
              <div class="form-group">
                <app-input-field
                  label="Trajanje aktivnosti (min)"
                  type="number"
                  [(ngModel)]="newActivity.activityDuration"
                  placeholder="Minuti"
                  [min]="1"
                  [disabled]="!isSessionActive">
                </app-input-field>
              </div>
              <div class="form-group">
                <app-input-field
                  label="Trajanje pauze (min)"
                  type="number"
                  [(ngModel)]="newActivity.breakDuration"
                  placeholder="Minuti"
                  [min]="0"
                  [disabled]="!isSessionActive">
                </app-input-field>
              </div>
            </div>

            <!-- Performance Fields -->
            <div class="form-row">
              <div class="form-group">
                <app-input-field
                  label="Brzina kucanja (WPM)"
                  type="number"
                  [(ngModel)]="newActivity.typingSpeed"
                  placeholder="Reči po minuti"
                  [min]="0"
                  [disabled]="!isSessionActive">
                </app-input-field>
              </div>
              <div class="form-group">
                <app-input-field
                  label="Broj grešaka"
                  type="number"
                  [(ngModel)]="newActivity.errors"
                  placeholder="Greške"
                  [min]="0"
                  [disabled]="!isSessionActive">
                </app-input-field>
              </div>
            </div>

            <div class="button-center">
              <app-button 
                (click)="addActivity()"
                [disabled]="!isActivityFormValid() || isSubmittingActivity || !isSessionActive"
                [label]="isSubmittingActivity ? 'Dodaje...' : 'Dodaj'"
                class="wide-btn">
              </app-button>
            </div>
          </div>
        </div>

        <!-- Right Section -->
        <div class="right-section">
          <!-- 24h Pie Chart -->
          <div class="chart-card">
            <h3>24h pregled</h3>
            <div class="chart-container">
              <canvas #pieChart></canvas>
            </div>
          </div>

          <!-- Activities History -->
          <div class="activities-card">
            <div class="activities-header-fixed">
              <h3>Aktivnosti u sesiji</h3>
            </div>
            <div class="activities-list-scroll">

              <div *ngIf="isSessionActive && activities.length > 0; else noActivities" class="activities-list">
                <div *ngFor="let act of activities" class="activity-item">
                  <div class="activity-header">
                    <span class="activity-type" [ngClass]="{'work': act.activityType === 'WORK', 'entertainment': act.activityType === 'ENTERTAINMENT'}">
                      {{ act.activityType === 'WORK' ? 'Rad' : 'Zabava' }}
                    </span>
                    <span class="device-type">({{ act.deviceType === 'COMPUTING_DEVICE' ? 'Računar' : 'Telefon' }})</span>
                    <span class="activity-time">{{ act.startTimestamp | date:'dd.MM.yyyy HH:mm' }}</span>
                  </div>
                  <div class="activity-details">
                    <span>Trajanje: {{ act.activityDuration }} min</span>
                    <span>Pauza: {{ act.breakDuration }} min</span>
                    <span>Brzina kucanja: {{ act.typingSpeed }} WPM</span>
                    <span>Greške: {{ act.errors }}</span>
                  </div>
                </div>
              </div>
              <ng-template #noActivities>
                <div class="no-activities">
                  <p *ngIf="isSessionActive"><i>Nema aktivnosti u trenutnoj sesiji</i></p>
                  <p *ngIf="!isSessionActive"><i>Pokrenite sesiju da biste videli aktivnosti</i></p>
                </div>
              </ng-template>
            </div>
          </div>

          <!-- Recommendations History -->
          <div class="recommendations-card">
            <h3>Poruke - Istorija</h3>
            <div *ngIf="isSessionActive && recommendations.length > 0; else noRecommendations" class="recommendations-list">
              <div 
                *ngFor="let rec of recommendations" 
                class="recommendation-item"
                [class.low]="rec.riskLevel === 'LOW'"
                [class.medium]="rec.riskLevel === 'MEDIUM'"
                [class.high]="rec.riskLevel === 'HIGH'"
                [class.critical]="rec.riskLevel === 'CRITICAL'">
                <div class="message">{{ rec.message }}</div>
                <div class="session-info">Sesija: {{ rec.sessionId }}</div>
              </div>
            </div>
            <ng-template #noRecommendations>
              <div class="no-recommendations">
                <p *ngIf="isSessionActive"><i>Počnite unosom prvog simptoma ili aktivnosti</i></p>
                <p *ngIf="!isSessionActive"><i>Pokrenite sesiju da biste videli preporuke</i></p>
              </div>
            </ng-template>
          </div>
        </div>
      </div>
    </div>

    <!-- Template Settings Modal -->
    <app-simple-template-settings 
      *ngIf="showTemplateSettings"
      [userId]="currentUserId"
      (close)="closeSettings()"
      (templateSaved)="onTemplateSaved($event)">
    </app-simple-template-settings>
  `,
  styles: [`
    .tiredness-dashboard {
      padding: 1rem;
      max-width: 1600px;
      margin: 0 auto;
    }

    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 0.5rem;
      margin-top: 0.5rem;
      background: var(--background-light);
      border-radius: 12px;
      padding: 0 1rem;
    }

    .logo {
      height: 60px;
    }

    .header-actions {
      display: flex;
      align-items: center;
      gap: 1rem;
    }

    .settings-btn {
      background: white;
      border: 2px solid #7B904B;
      border-radius: 50%;
      width: 50px;
      height: 50px;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      transition: all 0.3s ease;
      color: #7B904B;
    }

    .settings-btn:hover {
      background: #7B904B;
      color: white;
      transform: rotate(90deg);
    }

    .settings-btn svg {
      width: 24px;
      height: 24px;
    }

    .logo-img {
      height: 60px;
    }

    .session-control-center {
      display: flex;
      justify-content: center;
      align-items: center;
      width: 80%;
      margin-top: 1.5rem;
    }

    .button-center {
      display: flex;
      justify-content: center;
      align-items: center;
      width: 80%;
      margin-left: 10%;
      margin-top: 1rem;
    }

    .dashboard-content {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 2rem;
    }

    .left-section, .right-section {
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
    }

    .time-overview-card,
    .tiredness-level-card,
    .activity-form-card,
    .recommendations-card,
    .chart-card {
      background: white;
      border-radius: 12px;
      padding: 1.5rem;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
      border: 1px solid var(--border-light);
    }

    .time-overview-card h2 {
      margin: 0 0 1rem 0;
      color: var(--text-primary);
    }

    .total-time {
      text-align: center;
      margin-bottom: 1.5rem;
    }

    .total-time .time {
      font-size: 2rem;
      font-weight: bold;
      color: var(--primary);
      display: block;
    }

    .total-time .label {
      margin: 0.5rem 0 0 0;
      color: var(--text-secondary);
    }

    .time-breakdown {
      display: flex;
      justify-content: space-between;
      gap: 1rem;
    }

    .time-item {
      flex: 1;
      text-align: center;
      padding: 1rem;
      background: var(--background-light);
      border-radius: 8px;
    }

    .time-item .label {
      display: block;
      font-size: 0.875rem;
      color: var(--text-secondary);
      margin-bottom: 0.5rem;
    }

    .time-item .value {
      font-weight: 600;
      color: var(--text-primary);
    }

    .level-buttons {
      display: flex;
      gap: 0.5rem;
      margin: 1rem 0;
    }

    .level-btn {
      flex: 1;
      padding: 0.75rem;
      border: 2px solid var(--border-light);
      background: white;
      border-radius: 8px;
      cursor: pointer;
      transition: all 0.2s ease;
    }

    .level-btn:hover {
      border-color: var(--primary);
    }

    .level-btn.active {
      background: var(--primary);
      color: white;
      border-color: var(--primary);
    }

    .level-btn:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    .form-select:disabled {
      opacity: 0.5;
      cursor: not-allowed;
      background-color: var(--background-light);
    }

    .form-group {
      margin-bottom: 1rem;
    }

    .form-group label {
      display: block;
      margin-bottom: 0.5rem;
      font-weight: 500;
      color: var(--text-primary);
    }

    .form-select {
      width: 100%;
      padding: 0.75rem;
      border: 1px solid var(--border-light);
      border-radius: 8px;
      font-size: 1rem;
    }

    .recommendations-list {
      max-height: 300px;
      overflow-y: auto;
    }

    .recommendation-item {
      padding: 1rem;
      margin-bottom: 0.75rem;
      border-radius: 8px;
      border-left: 4px solid;
    }

    .recommendation-item.low {
      background: #f0f9f0;
      border-left-color: #4caf50;
    }

    .recommendation-item.medium {
      background: #fff8e1;
      border-left-color: #ff9800;
    }

    .recommendation-item.high {
      background: #ffebee;
      border-left-color: #f44336;
    }

    .recommendation-item.critical {
      background: #fce4ec;
      border-left-color: #e91e63;
    }

    .recommendation-item .message {
      font-weight: 500;
      margin-bottom: 0.25rem;
    }

    .recommendation-item .session-info {
      font-size: 0.875rem;
      color: var(--text-secondary);
    }

    .no-recommendations {
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.2rem;
      color: var(--text-secondary);
      height: 100%;
    }

    .chart-card {
      min-height: 320px;
      padding: 2rem 1rem;
      display: flex;
      flex-direction: column;
    }

    .chart-container {
      flex: 1;
      width: 100%;
      max-height: 340px;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .chart-container canvas {
      width: 100% !important;
      height: 100% !important;
      max-width: 100%;
      max-height: 100%;
    }

    @media (max-width: 768px) {
      .dashboard-content {
        grid-template-columns: 1fr;
      }
      
      .header {
        flex-direction: column;
        gap: 1rem;
      }
    }

    .button-center app-button,
    .session-control-center app-button {
        width: 100%;
        min-width: 100%;
        max-width: 100%;
        margin-left: 13% !important;
    }

    .button-center,
    .session-control-center {
      display: flex;
      justify-content: center;
      align-items: center;
      width: 100%;
      margin-left: 13% !important;
      margin-top: 1rem;
    }

    .right-section {
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
      height: 100%;
      flex-grow: 1;
    }

    .recommendations-card {
      min-height: 410px;
      height: auto;
      flex-grow: unset;
      display: flex;
      flex-direction: column;
      justify-content: center;
    }

    /* Activities Card Styles */
    .activities-card {
      background: white;
      border-radius: 12px;
      padding: 0;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
      border: 1px solid var(--border-light);
      min-height: 320px;
      max-height: 320px;
      margin-bottom: 0.1rem;
      display: flex;
      flex-direction: column;
    }
    .activities-header-fixed {
      padding: 1.5rem 1.5rem 0.5rem 1.5rem;
      background: white;
      border-top-left-radius: 12px;
      border-top-right-radius: 12px;
      z-index: 1;
    }
    .activities-list-scroll {
      flex: 1;
      overflow-y: auto;
      padding: 0 1.5rem 1.5rem 1.5rem;
      display: flex;
      flex-direction: column;
      min-height: 0;
    }
    .activities-list {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }
    .activity-item {
      padding: 1rem;
      border-radius: 8px;
      background: #f7f7f7;
      border-left: 4px solid #7B904B;
      margin-bottom: 0.5rem;
    }
    .activity-header {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      font-weight: 500;
      margin-bottom: 0.5rem;
    }
    .activity-type.work {
      color: #7B904B;
    }
    .activity-type.entertainment {
      color: #FF9800;
    }
    .device-type {
      color: #888;
      font-size: 0.95em;
    }
    .activity-time {
      margin-left: auto;
      color: #666;
      font-size: 0.95em;
    }
    .activity-details {
      display: flex;
      gap: 1.5rem;
      font-size: 0.97em;
      color: #444;
    }
    .no-activities {
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.1rem;
      color: var(--text-secondary);
      height: 100%;
    }
  `]
})
export class TirednessDashboardComponent implements OnInit, AfterViewInit, OnDestroy {
  activities: ActivityEvent[] = [];
  @ViewChild('pieChart', { static: false }) pieChartRef!: ElementRef<HTMLCanvasElement>;
  currentSessionId: number = 1;
  currentUserId: number = 100;
  isSessionActive: boolean = false;
  isStartingSession: boolean = false;

  timeData: TimeData = {
    totalTime: { hours: 0, minutes: 0 },
    workTime: { hours: 0, minutes: 0 },
    entertainmentTime: { hours: 0, minutes: 0 }
  };

  selectedTirednessLevel: number | null = null;
  isSubmittingLevel: boolean = false;

  newActivity: ActivityForm = {
    activityType: '',
    deviceType: '',
    startTime: '',
    activityDuration: null,
    breakDuration: null,
    typingSpeed: null,
    errors: null
  };
  isSubmittingActivity: boolean = false;

  recommendations: Recommendation[] = [];
  currentSession: Session | null = null;

  // Simulation properties
  simulationFiles = [
    { label: 'Rani umor', value: 'early-fatigue.json' },
    { label: 'Mentalni umor', value: 'mental-fatigue.json' },
    { label: 'Mešovito', value: 'mix.json' },
    { label: 'Visok rizik', value: 'high-risk.json' },
    { label: 'Backward', value: 'backward.json' },
  ];
  selectedSimulation: string | null = null;

  // Template settings
  showTemplateSettings: boolean = false;
  currentTemplate: Template | null = null;

  private pieChart: Chart | null = null;

  constructor(
    private tirednessService: TirednessService,
    private templateService: TemplateService
  ) {}

  ngOnInit() {
    // Restore session/user state from localStorage
    const storedUserId = localStorage.getItem('tiredness_userId');
    const storedSessionId = localStorage.getItem('tiredness_sessionId');
    const storedSessionActive = localStorage.getItem('tiredness_isSessionActive');
    // Always use userId=100 for consistency
    this.currentUserId = 100;
    localStorage.setItem('tiredness_userId', this.currentUserId.toString());
    if (storedSessionId) {
      this.currentSessionId = parseInt(storedSessionId, 10);
    }
    if (storedSessionActive) {
      this.isSessionActive = storedSessionActive === 'true';
    }
    if (this.isSessionActive) {
      this.loadCurrentSession();
    }
  }

  ngAfterViewInit() {
    this.createPieChart();
  }

  loadCurrentSession() {
    this.tirednessService.getCurrentSession(this.currentSessionId).subscribe({
      next: (sessionObj) => {
        console.log('SESSION RESPONSE:', sessionObj);
        this.currentSession = sessionObj;
        const events = (this.currentSession && Array.isArray(this.currentSession.activityEvents)) ? this.currentSession.activityEvents : [];
        this.activities = events
          .filter(act => act && typeof act === 'object')
          .map(({ id, sessionId, activityType, deviceType, startTimestamp, endTimestamp, activityDuration, breakDuration, typingSpeed, errors }) => ({
            id, sessionId, activityType, deviceType, startTimestamp, endTimestamp, activityDuration, breakDuration, typingSpeed, errors
          }));
        console.log('ACTIVITIES PARSED:', this.activities);
        this.calculateTimeData();
        this.updatePieChart();
        
        // Load recommendations for this session
        this.loadRecommendations();
      },
      error: (err) => {
        console.error('Error loading session:', err);
      }
    });
  }

  loadRecommendations() {
    console.log('Loading recommendations for sessionId:', this.currentSessionId);
    this.tirednessService.getRecommendationsForSession(this.currentSessionId).subscribe({
      next: (recommendations) => {
        console.log('RECOMMENDATIONS LOADED:', recommendations);
        console.log('Number of recommendations:', recommendations?.length || 0);
        this.recommendations = recommendations || [];
      },
      error: (err) => {
        console.error('Error loading recommendations for sessionId:', this.currentSessionId, err);
        this.recommendations = [];
      }
    });
  }

  calculateTimeData() {
    if (!this.currentSession) return;

    let totalWorkMinutes = 0;
    let totalEntertainmentMinutes = 0;

    this.currentSession.activityEvents.forEach(event => {
      if (event.activityType === 'WORK') {
        totalWorkMinutes += event.activityDuration;
      } else if (event.activityType === 'ENTERTAINMENT') {
        totalEntertainmentMinutes += event.activityDuration;
      }
    });

    const totalMinutes = totalWorkMinutes + totalEntertainmentMinutes;

    this.timeData = {
      totalTime: this.minutesToHoursMinutes(totalMinutes),
      workTime: this.minutesToHoursMinutes(totalWorkMinutes),
      entertainmentTime: this.minutesToHoursMinutes(totalEntertainmentMinutes)
    };
  }

  calculateTimeDataFromActivities() {
    let totalWorkMinutes = 0;
    let totalEntertainmentMinutes = 0;

    this.activities.forEach(event => {
      if (event.activityType === 'WORK') {
        totalWorkMinutes += event.activityDuration;
      } else if (event.activityType === 'ENTERTAINMENT') {
        totalEntertainmentMinutes += event.activityDuration;
      }
    });

    const totalMinutes = totalWorkMinutes + totalEntertainmentMinutes;

    this.timeData = {
      totalTime: this.minutesToHoursMinutes(totalMinutes),
      workTime: this.minutesToHoursMinutes(totalWorkMinutes),
      entertainmentTime: this.minutesToHoursMinutes(totalEntertainmentMinutes)
    };
    
    console.log('Time data calculated from activities:', this.timeData);
  }

  private minutesToHoursMinutes(minutes: number): { hours: number, minutes: number } {
    return {
      hours: Math.floor(minutes / 60),
      minutes: minutes % 60
    };
  }

  selectTirednessLevel(level: number) {
    this.selectedTirednessLevel = level;
  }

  submitTirednessLevel() {
    if (!this.selectedTirednessLevel) return;

    this.isSubmittingLevel = true;
    this.tirednessService.reportTirednessLevel(this.currentSessionId, this.selectedTirednessLevel).subscribe({
      next: (recommendation) => {
        this.isSubmittingLevel = false;
        this.selectedTirednessLevel = null;
        
        console.log('Received backward chaining recommendation:', recommendation);
        
        // Add the recommendation to the recommendations list if it's not null
        if (recommendation && recommendation.message) {
          // Check if the recommendation is already in the list to avoid duplicates
          const isDuplicate = this.recommendations.some(
            rec => rec.message === recommendation.message && rec.sessionId === recommendation.sessionId
          );
          
          if (!isDuplicate) {
            this.recommendations = [...this.recommendations, recommendation];
            console.log('Added backward chaining recommendation to list. New list:', this.recommendations);
          } else {
            console.log('Recommendation already exists in the list, not adding duplicate');
          }
        }
      },
      error: (err) => {
        console.error('Error submitting tiredness level:', err);
        this.isSubmittingLevel = false;
      }
    });
  }

  isActivityFormValid(): boolean {
    return !!this.newActivity.activityType && 
           !!this.newActivity.deviceType &&
           !!this.newActivity.startTime &&
           this.newActivity.activityDuration !== null && 
           this.newActivity.activityDuration > 0 &&
           this.newActivity.breakDuration !== null &&
           this.newActivity.typingSpeed !== null &&
           this.newActivity.errors !== null;
  }

  addActivity() {
    if (!this.isActivityFormValid() || !this.isSessionActive) return;

    this.isSubmittingActivity = true;

    // Convert datetime-local to timestamp
    const startTimestamp = new Date(this.newActivity.startTime).getTime();
    const endTimestamp = startTimestamp + (this.newActivity.activityDuration! * 60 * 1000);
    const activityRequest: CreateActivityEventRequest = {
      id: Date.now(),
      sessionId: this.currentSessionId,
      activityType: this.newActivity.activityType as 'WORK' | 'ENTERTAINMENT',
      deviceType: this.newActivity.deviceType as 'COMPUTING_DEVICE' | 'PHONE_DEVICE',
      startTimestamp: startTimestamp,
      endTimestamp: endTimestamp,
      activityDuration: Number(this.newActivity.activityDuration!),
      breakDuration: Number(this.newActivity.breakDuration || 0),
      typingSpeed: Number(this.newActivity.typingSpeed!),
      errors: Number(this.newActivity.errors!)
    };

    this.tirednessService.addEvent(activityRequest).subscribe({
      next: (recommendations) => {
        this.isSubmittingActivity = false;
        this.newActivity = {
          activityType: '',
          deviceType: '',
          startTime: '',
          activityDuration: null,
          breakDuration: null,
          typingSpeed: null,
          errors: null
        };
        
        // Update recommendations from the response
        if (recommendations) {
          this.recommendations = recommendations;
        }
        
        // Reload session to get updated activities
        this.loadCurrentSession();
      },
      error: (err) => {
        console.error('Error adding activity:', err);
        this.isSubmittingActivity = false;
      }
    });
  }

  createPieChart() {
    if (!this.pieChartRef?.nativeElement) return;

    const ctx = this.pieChartRef.nativeElement.getContext('2d');
    if (!ctx) return;

    const totalMinutesInDay = 24 * 60;
    const usedMinutes = this.timeData.workTime.hours * 60 + this.timeData.workTime.minutes +
                      this.timeData.entertainmentTime.hours * 60 + this.timeData.entertainmentTime.minutes;
    const unusedMinutes = totalMinutesInDay - usedMinutes;

    const config: ChartConfiguration = {
      type: 'pie',
      data: {
        labels: ['Rad', 'Zabava', 'Ostalo vreme'],
        datasets: [{
          data: [
            this.timeData.workTime.hours * 60 + this.timeData.workTime.minutes,
            this.timeData.entertainmentTime.hours * 60 + this.timeData.entertainmentTime.minutes,
            unusedMinutes
          ],
          backgroundColor: [
            '#7B904B', 
            '#FF9800',
            '#E0E0E0'
          ],
          borderWidth: 2,
          borderColor: '#fff'
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'bottom',
            labels: {
              padding: 20,
              usePointStyle: true
            }
          },
          tooltip: {
            callbacks: {
              label: (context) => {
                const value = context.parsed;
                const h = Math.floor(value / 60);
                const m = value % 60;
                let timeStr = '';
                if (h > 0) timeStr += h + 'h';
                if (m > 0) timeStr += (h > 0 ? ' ' : '') + m + 'min';
                if (timeStr === '') timeStr = '0min';
                return `${context.label}: ${timeStr}`;
              }
            }
          }
        }
      }
    };

    this.pieChart = new Chart(ctx, config);
  }

  updatePieChart() {
    if (!this.pieChart) return;

    const totalMinutesInDay = 24 * 60;
    const usedMinutes = this.timeData.workTime.hours * 60 + this.timeData.workTime.minutes +
                      this.timeData.entertainmentTime.hours * 60 + this.timeData.entertainmentTime.minutes;
    const unusedMinutes = totalMinutesInDay - usedMinutes;

    this.pieChart.data.datasets[0].data = [
      this.timeData.workTime.hours * 60 + this.timeData.workTime.minutes,
      this.timeData.entertainmentTime.hours * 60 + this.timeData.entertainmentTime.minutes,
      unusedMinutes
    ];

    this.pieChart.update();
  }

  startSession() {
    this.isStartingSession = true;
    // Create a sample session
    const sampleSession: Session = {
      sessionId: this.currentSessionId,
      userId: this.currentUserId,
      startTimestamp: Date.now(),
      endTimestamp: 0,
      activityEvents: []
    };
    const sessionDTO: SessionDTO = {
      sessions: [sampleSession]
    };
    this.tirednessService.initSession(sessionDTO).subscribe({
      next: () => {
        this.isSessionActive = true;
        localStorage.setItem('tiredness_isSessionActive', 'true');
        localStorage.setItem('tiredness_sessionId', this.currentSessionId.toString());
        this.isStartingSession = false;
        this.loadCurrentSession();
      },
      error: (err) => {
        console.error('Error starting session:', err);
        this.isStartingSession = false;
      }
    });
  }

  startNewSession() {
    this.isStartingSession = true;
    // Reset all session-related data
    this.timeData = {
      totalTime: { hours: 0, minutes: 0 },
      workTime: { hours: 0, minutes: 0 },
      entertainmentTime: { hours: 0, minutes: 0 }
    };
    this.activities = [];
    this.recommendations = [];
    this.currentSession = null;

    // Start new session
    this.currentSessionId++;
    localStorage.setItem('tiredness_sessionId', this.currentSessionId.toString());
    localStorage.setItem('tiredness_isSessionActive', 'true');
    this.startSession();
    this.isStartingSession = false;
  }

  runSimulation() {
    if (!this.selectedSimulation) return;
    
    const filePath = `simulations/${this.selectedSimulation}`;
    fetch(filePath)
      .then(res => res.json())
      .then(json => {
        // Extract sessionId and activities from JSON
        const simulationSessionId = json.sessions && json.sessions.length > 0 ? json.sessions[0].sessionId : null;
        const simulationActivities = json.sessions && json.sessions.length > 0 ? json.sessions[0].activityEvents : [];
        
        console.log('Simulation JSON loaded:', {
          sessionId: simulationSessionId,
          activitiesCount: simulationActivities.length,
          activities: simulationActivities
        });
        
        this.tirednessService.initSession(json).subscribe({
          next: () => {
            if (simulationSessionId) {
              // Set the simulation sessionId as current
              console.log('Setting currentSessionId from', this.currentSessionId, 'to', simulationSessionId);
              this.currentSessionId = simulationSessionId;
              localStorage.setItem('tiredness_sessionId', this.currentSessionId.toString());
              localStorage.setItem('tiredness_isSessionActive', 'true');
              this.isSessionActive = true;
              
              // CLEAR all previous data before loading new simulation
              this.activities = [];
              this.recommendations = [];
              
              // Load activities directly from JSON first
              this.activities = simulationActivities || [];
              console.log('Activities loaded from JSON:', this.activities);
              
              // Calculate time data from activities
              this.calculateTimeDataFromActivities();
              this.updatePieChart();
              
              // Load only recommendations from backend, keep activities from JSON  
              setTimeout(() => {
                console.log('Before setTimeout calls - currentSessionId:', this.currentSessionId);
                // Don't call loadCurrentSession() - it overwrites activities from JSON with empty backend data
                // this.loadCurrentSession();
                this.loadRecommendations();
              }, 2000);
              
              // Reset simulation selection
              this.selectedSimulation = null;
            } else {
              // Fallback to page reload if no sessionId found
              window.location.reload();
            }
          },
          error: (err) => {
            alert('Greška pri pokretanju simulacije!');
            console.error('Error running simulation:', err);
          }
        });
      })
      .catch(err => {
        alert('Ne mogu da učitam JSON fajl simulacije!');
        console.error('Error loading simulation file:', err);
      });
  }

  // Template Settings Methods
  openSettings() {
    this.showTemplateSettings = true;
    this.loadCurrentTemplate();
  }

  closeSettings() {
    this.showTemplateSettings = false;
  }

  onTemplateSaved(template: Template) {
    this.currentTemplate = template;
    console.log('Template updated:', template);
    // Ugasi modal kada je template sačuvan
    this.showTemplateSettings = false;
    // Ovde možemo dodati logiku za ponovno učitavanje pravila
    // ili notifikaciju korisniku da su postavke sačuvane
  }

  private loadCurrentTemplate() {
    this.templateService.getUserTemplate(this.currentUserId).subscribe({
      next: (template: Template) => {
        this.currentTemplate = template;
      },
      error: (err: any) => {
        console.error('Error loading current template:', err);
      }
    });
  }

  ngOnDestroy() {
    if (this.pieChart) {
      this.pieChart.destroy();
    }
    // Optionally, persist state on destroy (not strictly needed with localStorage on every change)
  }
}