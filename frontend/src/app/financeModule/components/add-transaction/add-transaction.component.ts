import { Component, EventEmitter, Output, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonComponent } from '../../../sharedModule/button/button.component';
import { InputFieldComponent } from '../../../sharedModule/input-field/input-field.component';
import { IncomeService, CreateIncomeRequest } from '../../services/income.service';
import { ExpenseService, CreateExpenseRequest } from '../../services/expense.service';
import { CategoryService, Category, CreateCategoryRequest } from '../../services/category.service';

interface TransactionData {
  type: 'expense' | 'income' | 'budget';
  amount: number;
  category?: string;
  description?: string;
}

@Component({
  selector: 'app-add-event',
  standalone: true,
  imports: [CommonModule, FormsModule, ButtonComponent, InputFieldComponent],
  template: `
    <div class="add-event-card">
      <div class="event-type-tabs">
        <button 
          class="tab-button"
          [class.active]="activeTab === 'symptom'"
          (click)="setActiveTab('symptom')">
          Unos simptoma
        </button>
        <button 
          class="tab-button"
          [class.active]="activeTab === 'activity'"
          (click)="setActiveTab('activity')">
          Unos aktivnosti
        </button>
      </div>

      <div class="form-content">
        <app-input-field
          label="Opis"
          [(ngModel)]="description"
          placeholder="Unesite opis simptoma ili aktivnosti">
        </app-input-field>

        <app-input-field
          label="Vreme (u satima)"
          type="number"
          [(ngModel)]="duration"
          placeholder="Unesite vreme"
          [min]="0">
        </app-input-field>

        <div class="form-actions">
          <app-button 
            (click)="onSubmit()" 
            [disabled]="!isFormValid() || isSubmitting">
            <i class="fas fa-plus" *ngIf="!isSubmitting"></i>
            <i class="fas fa-spinner fa-spin" *ngIf="isSubmitting"></i>
            {{ isSubmitting ? 'Dodavanje...' : 'Dodaj' }}
          </app-button>
        </div>
      </div>
    </div>
  `,
  styleUrl: './add-transaction.component.scss'
})
export class AddEventComponent implements OnInit {
  @Output() eventAdded = new EventEmitter<any>();

  activeTab: 'symptom' | 'activity' = 'symptom';
  description: string = '';
  duration: number | null = null;
  isSubmitting: boolean = false;

  constructor() {}

  ngOnInit() {}

  setActiveTab(tab: 'symptom' | 'activity') {
    this.activeTab = tab;
    this.clearForm();
  }

  isFormValid(): boolean {
    return !!this.description && this.duration !== null && this.duration > 0;
  }

  onSubmit() {
    if (this.isFormValid() && !this.isSubmitting) {
      this.isSubmitting = true;
      // TODO: Pozvati API za unos simptoma/aktivnosti
      const data = {
        type: this.activeTab,
        description: this.description,
        duration: this.duration
      };
      this.eventAdded.emit(data);
      this.clearForm();
      this.isSubmitting = false;
    }
  }

  clearForm() {
    this.description = '';
    this.duration = null;
    this.isSubmitting = false;
  }
}