import { Component, OnInit, AfterViewInit, ViewChild, ElementRef, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ButtonComponent } from '../../sharedModule/button/button.component';
import { InputFieldComponent } from '../../sharedModule/input-field/input-field.component';
import { TirednessService, Session, SessionDTO, ActivityEvent, Recommendation, CreateActivityEventRequest } from '../services/tiredness.service';
import { Chart, ChartConfiguration } from 'chart.js/auto';

interface TimeData {
  totalTime: { hours: number, minutes: number };
  workTime: { hours: number, minutes: number };
  entertainmentTime: { hours: number, minutes: number };
}

@Component({
  selector: 'app-tiredness-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, ButtonComponent, InputFieldComponent],
  template: `
    <div class="tiredness-dashboard">
      <!-- Header with Logo -->
      <div class="header">
        <div class="logo-section">
          <img src="logo/logo-text.png" alt="Digital Care Logo" class="logo"/>
        </div>

        <div class="logo-img-section">
          <img src="logo/logo-img.png" alt="Digital Care" class="logo-img"/>
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
            <div class="form-group">
              <label>Tip aktivnosti</label>
              <select [(ngModel)]="newActivity.category" class="form-select" [disabled]="!isSessionActive">
                <option value="">Izaberi aktivnost</option>
                <option value="activityDuration">Activity Duration</option>
                <option value="breakDuration">Break Duration</option>
                <option value="typingSpeed">Typing Speed</option>
                <option value="errors">Errors</option>
              </select>
            </div>
            <div class="form-group">
              <app-input-field
                label="Vreme (minuti)"
                type="number"
                [(ngModel)]="newActivity.duration"
                placeholder="Unesite vreme u minutama"
                [min]="0"
                [disabled]="!isSessionActive">
              </app-input-field>
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
  `,
  styles: [`
    .tiredness-dashboard {
      padding: 1rem;
      max-width: 1400px;
      margin: 0 auto;
    }

    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 2rem;
      background: var(--background-light);
      padding: 1rem;
      border-radius: 12px;
    }

    .logo {
      height: 40px;
    }

    .logo-img {
      height: 50px;
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
      min-height: 460px;
      height: auto;
      flex-grow: unset;
      display: flex;
      flex-direction: column;
      justify-content: center;
    }
  `]
})
export class TirednessDashboardComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('pieChart', { static: false }) pieChartRef!: ElementRef<HTMLCanvasElement>;
  currentSessionId: number = 1; // TODO: Get from auth service or route params
  currentUserId: number = 1; // TODO: Get from auth service

  isSessionActive: boolean = false;
  isStartingSession: boolean = false;

  timeData: TimeData = {
    totalTime: { hours: 0, minutes: 0 },
    workTime: { hours: 0, minutes: 0 },
    entertainmentTime: { hours: 0, minutes: 0 }
  };

  selectedTirednessLevel: number | null = null;
  isSubmittingLevel: boolean = false;

  newActivity = {
    category: '',
    duration: null as number | null
  };
  isSubmittingActivity: boolean = false;

  recommendations: Recommendation[] = [];
  currentSession: Session | null = null;

  private pieChart: Chart | null = null;

  constructor(private tirednessService: TirednessService) {}

  ngOnInit() {
    // Don't auto-load session data - wait for user to start session
  }

  ngAfterViewInit() {
    this.createPieChart();
  }

  loadCurrentSession() {
    this.tirednessService.getCurrentSession(this.currentSessionId).subscribe({
      next: (sessionDTO) => {
        if (sessionDTO.sessions.length > 0) {
          this.currentSession = sessionDTO.sessions[0];
          this.calculateTimeData();
          this.updatePieChart();
        }
      },
      error: (err) => {
        console.error('Error loading session:', err);
      }
    });
  }

  loadRecommendations() {
    this.tirednessService.getRecommendationsForUser(this.currentUserId).subscribe({
      next: (recommendations) => {
        // Backend returns null for now, so handle empty recommendations
        this.recommendations = recommendations || [];
      },
      error: (err) => {
        console.error('Error loading recommendations:', err);
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
    this.tirednessService.submitTirednessLevel(this.currentSessionId, this.selectedTirednessLevel).subscribe({
      next: () => {
        this.isSubmittingLevel = false;
        this.selectedTirednessLevel = null;
        // Show success message if needed
      },
      error: (err) => {
        console.error('Error submitting tiredness level:', err);
        this.isSubmittingLevel = false;
      }
    });
  }

  isActivityFormValid(): boolean {
    return !!this.newActivity.category && this.newActivity.duration !== null && this.newActivity.duration > 0;
  }

  addActivity() {
    if (!this.isActivityFormValid() || !this.isSessionActive) return;

    this.isSubmittingActivity = true;

    const activityRequest: CreateActivityEventRequest = {
      sessionId: this.currentSessionId,
      activityType: 'WORK', // Default, could be determined by category
      deviceType: 'COMPUTING_DEVICE', // Default
      activityDuration: this.newActivity.duration!,
      breakDuration: 0,
      typingSpeed: this.newActivity.category === 'typingSpeed' ? this.newActivity.duration! : 0,
      errors: this.newActivity.category === 'errors' ? this.newActivity.duration! : 0,
      category: this.newActivity.category,
      mouseMovements: 0
    };

    this.tirednessService.addEvent(activityRequest).subscribe({
      next: (newRecommendations) => {
        this.isSubmittingActivity = false;
        this.newActivity = { category: '', duration: null };
        
        // Add new recommendations to the list
        this.recommendations = [...newRecommendations, ...this.recommendations];
        
        // Reload session data
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
      subjectiveTirednessLevel: 0,
      risks: [],
      riskLevel: 0,
      activityEvents: []
    };

    const sessionDTO: SessionDTO = {
      sessions: [sampleSession]
    };

    this.tirednessService.initSession(sessionDTO).subscribe({
      next: () => {
        this.isSessionActive = true;
        this.isStartingSession = false;
        this.loadCurrentSession();
        this.loadRecommendations();
      },
      error: (err) => {
        console.error('Error starting session:', err);
        this.isStartingSession = false;
      }
    });
  }

  startNewSession() {
    this.isStartingSession = true;
    
    // First end current session
    this.tirednessService.endSession().subscribe({
      next: () => {
        // Then start new session
        this.currentSessionId++; // Increment session ID
        this.startSession();
      },
      error: (err) => {
        console.error('Error ending session:', err);
        this.isStartingSession = false;
      }
    });
  }

  ngOnDestroy() {
    if (this.pieChart) {
      this.pieChart.destroy();
    }
  }
}