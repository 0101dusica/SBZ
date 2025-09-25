import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonComponent } from '../../../sharedModule/button/button.component';

@Component({
  selector: 'app-event-history',
  standalone: true,
  imports: [CommonModule, FormsModule, ButtonComponent],
  template: `
    <div class="event-history">
      <div class="history-header">
        <h2>Evidencija</h2>
        <div class="header-actions">
          <select 
            class="sort-select"
            [(ngModel)]="sortOrder"
            (ngModelChange)="onSortChange()">
            <option value="default">Podrazumevano</option>
            <option value="date-desc">Najnovije</option>
            <option value="date-asc">Najstarije</option>
            <option value="duration-desc">Najduže vreme</option>
            <option value="duration-asc">Najkraće vreme</option>
          </select>
          <app-button 
            variant="outline" 
            size="small"
            (click)="openAnalytics()">
            <i class="fas fa-chart-bar"></i> Analitika
          </app-button>
        </div>
      </div>

      <div class="loading-state" *ngIf="isLoading">
        <div class="loading-spinner"></div>
        <p>Učitavanje događaja...</p>
      </div>

      <div class="event-list" *ngIf="!isLoading && sortedEvents.length > 0; else emptyState">
        <div 
          class="event-item"
          *ngFor="let event of sortedEvents; trackBy: trackByEventId">
          <div class="event-info">
            <div class="type-description">
              <h4 class="type" [class.symptom]="event.type === 'symptom'" [class.activity]="event.type === 'activity'">
                {{ event.type === 'symptom' ? 'Simptom' : 'Aktivnost' }}
              </h4>
              <div class="description-date">
                <span class="description">{{ event.description }}</span>
                <span class="date">{{ event.date | date:'dd/MM/yyyy HH:mm' }}</span>
              </div>
            </div>
            <div class="duration">
              <span>{{ event.duration }}h</span>
            </div>
          </div>
          <div class="event-actions">
            <app-button 
              variant="icon" 
              size="small"
              (click)="editEvent(event)">
              <i class="fas fa-edit"></i>
            </app-button>
            <app-button 
              variant="icon" 
              size="small"
              (click)="deleteEvent(event.id)">
              <i class="fas fa-trash"></i>
            </app-button>
          </div>
        </div>
      </div>

      <ng-template #emptyState>
        <div class="empty-state" *ngIf="!isLoading">
          <i class="fas fa-receipt"></i>
          <h3>Još nema događaja</h3>
          <p>Počnite unosom prvog simptoma ili aktivnosti</p>
        </div>
      </ng-template>
    </div>
  `,
  styleUrl: './transaction-history.component.scss'
})
export class EventHistoryComponent implements OnInit {
  @Input() events: any[] = [];
  @Output() editRequested = new EventEmitter<any>();
  @Output() deleteRequested = new EventEmitter<string>();
  @Output() analyticsOpened = new EventEmitter<void>();

  sortOrder: string = 'default';
  sortedEvents: any[] = [];
  isLoading = false;

  constructor() {}

  ngOnInit() {
    this.updateSortedEvents();
  }

  ngOnChanges() {
    this.updateSortedEvents();
  }

  onSortChange() {
    this.updateSortedEvents();
  }

  updateSortedEvents() {
    let sorted = [...this.events];
    switch (this.sortOrder) {
      case 'date-desc':
        sorted.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        break;
      case 'date-asc':
        sorted.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
        break;
      case 'duration-desc':
        sorted.sort((a, b) => b.duration - a.duration);
        break;
      case 'duration-asc':
        sorted.sort((a, b) => a.duration - b.duration);
        break;
      default:
        break;
    }
    this.sortedEvents = sorted;
  }

  trackByEventId(index: number, event: any): string {
    return event.id;
  }

  editEvent(event: any) {
    // TODO: Implement edit functionality
    this.editRequested.emit(event);
  }

  deleteEvent(id: string) {
    // TODO: Call delete API
    this.deleteRequested.emit(id);
  }

  openAnalytics() {
    // TODO: Navigate to analytics page or open modal
    this.analyticsOpened.emit();
  }
}

