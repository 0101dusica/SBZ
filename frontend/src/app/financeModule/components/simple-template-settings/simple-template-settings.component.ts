import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TemplateService, Template } from '../../services/template.service';

@Component({
  selector: 'app-simple-template-settings',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="overlay" (click)="closeModal()">
      <div class="template-container" (click)="$event.stopPropagation()" *ngIf="template">
        <div class="header">
          <h3>Personalizuj pravila za prepoznavanje zamora</h3>
          <button class="close-btn" (click)="closeModal()">&times;</button>
        </div>
      
      <!-- WORK pragovi -->
      <div class="section">
        <h4>Pragovi za RAD (minuti)</h4>
        
        <div class="setting-row">
          <label>Početak blagog upozorenja (LOW):</label>
          <input type="number" [(ngModel)]="template.workLowThreshold" 
                 min="30" max="300" class="number-input">
          <span class="unit">min</span>
        </div>

        <div class="setting-row">
          <label>Početak umerenog upozorenja (MEDIUM):</label>
          <input type="number" [(ngModel)]="template.workMediumThreshold" 
                 min="60" max="300" class="number-input">
          <span class="unit">min</span>
        </div>

        <div class="setting-row">
          <label>Početak visokog upozorenja (HIGH):</label>
          <input type="number" [(ngModel)]="template.workHighThreshold" 
                 min="90" max="500" class="number-input">
          <span class="unit">min</span>
        </div>
      </div>

      <!-- ENTERTAINMENT pragovi -->
      <div class="section">
        <h4>Pragovi za ZABAVU (minuti)</h4>
        
        <div class="setting-row">
          <label>Početak blagog upozorenja (LOW):</label>
          <input type="number" [(ngModel)]="template.entertainmentLowThreshold" 
                 min="30" max="300" class="number-input">
          <span class="unit">min</span>
        </div>

        <div class="setting-row">
          <label>Početak umerenog upozorenja (MEDIUM):</label>
          <input type="number" [(ngModel)]="template.entertainmentMediumThreshold" 
                 min="60" max="400" class="number-input">
          <span class="unit">min</span>
        </div>

        <div class="setting-row">
          <label>Početak visokog upozorenja (HIGH):</label>
          <input type="number" [(ngModel)]="template.entertainmentHighThreshold" 
                 min="90" max="500" class="number-input">
          <span class="unit">min</span>
        </div>
      </div>

      <!-- Nivoi reakcije -->
      <div class="section">
        <h4>Aktiviraj upozorenja za:</h4>
        
        <div class="checkbox-row">
          <label>
            <input type="checkbox" [(ngModel)]="template.enableLowAction">
            Blagi umor (kratke pauze)
          </label>
        </div>
        
        <div class="checkbox-row">
          <label>
            <input type="checkbox" [(ngModel)]="template.enableMediumAction">
            Umeren umor (duže pauze)
          </label>
        </div>
        
        <div class="checkbox-row">
          <label>
            <input type="checkbox" [(ngModel)]="template.enableHighAction">
            Visok umor (obavezne pauze)
          </label>
        </div>
      </div>

      <!-- Akcije -->
      <div class="actions">
        <button (click)="closeModal()" class="btn btn-outline">
          Otkaži
        </button>
        <button (click)="saveTemplate()" [disabled]="isSaving" class="btn btn-primary">
          {{ isSaving ? 'Čuva...' : 'Sačuvaj' }}
        </button>
        <button (click)="resetToDefault()" class="btn btn-reset" styles="flex: 1; width: 100%;">
          Reset na podrazumevano
        </button>
        <button (click)="previewRules()" class="btn btn-secondary" [disabled]="isGenerating">
          {{ isGenerating ? 'Generiše...' : 'Prikaži generisana pravila' }}
        </button>
      </div>

      <!-- Prikaz generisanih pravila -->
      <div class="generated-rules" *ngIf="generatedRules">
        <h4>Generisana pravila:</h4>
        <pre class="rules-preview">{{ generatedRules }}</pre>
      </div>

      <!-- Status poruke -->
      <div class="status-message" *ngIf="statusMessage" 
           [ngClass]="{'success': isSuccess, 'error': !isSuccess}">
        {{ statusMessage }}
      </div>
    </div>
  `,
  styles: [`
    .overlay {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.5);
      display: flex;
      justify-content: center;
      align-items: center;
      z-index: 1000;
    }

    .template-container {
      padding: 1.5rem;
      background: white;
      border-radius: 12px;
      box-shadow: 0 20px 60px rgba(0,0,0,0.3);
      width: 90%;
      max-width: 600px;
      max-height: 90vh;
      overflow-y: auto;
    }

    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1.5rem;
      padding-bottom: 1rem;
      border-bottom: 1px solid #eee;
    }

    .close-btn {
      background: none;
      border: none;
      font-size: 2rem;
      cursor: pointer;
      color: #999;
      padding: 0;
      width: 40px;
      height: 40px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 50%;
      transition: all 0.2s ease;
    }

    .close-btn:hover {
      background: #f5f5f5;
      color: #333;
    }

    h3 { color: #333; margin-bottom: 1.5rem; }
    h4 { color: #555; margin: 1rem 0 0.5rem 0; font-size: 1.1rem; }

    .section {
      margin-bottom: 2rem;
      padding-bottom: 1rem;
      border-bottom: 1px solid #eee;
    }

    .setting-row {
      display: flex;
      align-items: center;
      margin-bottom: 1rem;
      gap: 1rem;
    }

    .setting-row label {
      min-width: 200px;
      font-weight: 500;
    }

    .number-input {
      width: 80px;
      padding: 0.5rem;
      border: 1px solid #ddd;
      border-radius: 4px;
      text-align: center;
    }

    .unit {
      color: #666;
      font-size: 0.9rem;
    }

    .checkbox-row {
      margin-bottom: 0.8rem;
    }

    .checkbox-row label {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      cursor: pointer;
    }

    .actions {
      display: flex;
      gap: 1rem;
      margin-top: 2rem;
      flex-wrap: wrap;
    }

    .btn {
      padding: 0.75rem 1.5rem;
      border: none;
      border-radius: 6px;
      cursor: pointer;
      font-size: 0.95rem;
      transition: all 0.2s ease;
    }

    .btn:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }

    .btn-primary {
      background: #7B904B;
      width: 47%;
      margin-left: 3%;
      color: white;
    }

    .btn-primary:hover:not(:disabled) {
      background: #6a7d42;
    }

    .btn-outline {
      width: 47%;
      background: transparent;
      border: 1px solid #7B904B;
      color: #7B904B;
    }

    .btn-outline:hover:not(:disabled) {
      background: #7B904B;
      color: white;
    }

    .btn-reset{
      width: 100%;
      background: transparent;
      border: 1px solid #6c757d;
      color: #6c757d;
    }

    .btn-reset:hover:not(:disabled) {
      background: #6c757d;
      color: white;
    }

    .btn-secondary {
      background: #6c757d;
      width: 100%;
      color: white;
    }

    .btn-secondary:hover:not(:disabled) {
      background: #545b62;
    }

    .generated-rules {
      margin-top: 2rem;
      padding: 1rem;
      background: #f8f9fa;
      border-radius: 6px;
      border-left: 4px solid #7B904B;
    }

    .rules-preview {
      background: #2d3748;
      color: #e2e8f0;
      padding: 1rem;
      border-radius: 4px;
      font-family: 'Courier New', monospace;
      font-size: 0.85rem;
      line-height: 1.4;
      overflow-x: auto;
      max-height: 300px;
      overflow-y: auto;
    }

    .status-message {
      margin-top: 1rem;
      padding: 0.75rem;
      border-radius: 4px;
      font-weight: 500;
    }

    .success {
      background: #d4edda;
      color: #155724;
      border: 1px solid #c3e6cb;
    }

    .error {
      background: #f8d7da;
      color: #721c24;
      border: 1px solid #f5c6cb;
    }

    input[type="checkbox"] {
      width: 18px;
      height: 18px;
      accent-color: #7B904B;
    }

    @media (max-width: 768px) {
      .setting-row {
        flex-direction: column;
        align-items: flex-start;
      }

      .setting-row label {
        min-width: auto;
      }

      .actions {
        flex-direction: column;
      }

      .btn {
        width: 100%;
      }
    }
  `]
})
export class SimpleTemplateSettingsComponent implements OnInit {
  @Input() userId: number = 1;
  @Output() templateSaved = new EventEmitter<Template>();
  @Output() close = new EventEmitter<void>();

  template: Template | null = null;
  isSaving: boolean = false;
  isGenerating: boolean = false;
  generatedRules: string = '';
  statusMessage: string = '';
  isSuccess: boolean = false;

  constructor(private templateService: TemplateService) {}

  ngOnInit() {
    this.loadUserTemplate();
  }

  loadUserTemplate() {
    this.templateService.getUserTemplate(this.userId).subscribe({
      next: (template) => {
        this.template = template;
        console.log('Loaded template for user:', this.userId, template);
      },
      error: (err) => {
        console.error('Error loading template:', err);
        this.showMessage('Greška pri učitavanju template-a', false);
        
        // Fallback to default
        this.templateService.getDefaultTemplate().subscribe({
          next: (defaultTemplate) => {
            this.template = defaultTemplate;
          }
        });
      }
    });
  }

  saveTemplate() {
    if (!this.template) return;

    this.isSaving = true;
    this.templateService.saveUserTemplate(this.userId, this.template).subscribe({
      next: (savedTemplate) => {
        this.isSaving = false;
        this.showMessage('Template je uspešno sačuvan!', true);
        this.templateSaved.emit(savedTemplate);
        console.log('Template saved successfully:', savedTemplate);
      },
      error: (err) => {
        console.error('Error saving template:', err);
        this.isSaving = false;
        this.showMessage('Greška pri čuvanju template-a', false);
      }
    });
  }

  resetToDefault() {
    this.templateService.resetToDefault(this.userId).subscribe({
      next: (defaultTemplate) => {
        this.template = defaultTemplate;
        this.generatedRules = ''; // Clear generated rules
        this.showMessage('Template je resetovan na podrazumevano', true);
        console.log('Reset to default template:', defaultTemplate);
      },
      error: (err) => {
        console.error('Error resetting to default:', err);
        this.showMessage('Greška pri resetovanju template-a', false);
      }
    });
  }

  previewRules() {
    this.isGenerating = true;
    this.templateService.generateDynamicRules(this.userId).subscribe({
      next: (rules) => {
        this.isGenerating = false;
        this.generatedRules = rules;
        this.showMessage('Pravila su uspešno generisana!', true);
      },
      error: (err) => {
        console.error('Error generating rules:', err);
        this.isGenerating = false;
        this.showMessage('Greška pri generisanju pravila', false);
      }
    });
  }

  closeModal() {
    this.close.emit();
  }

  private showMessage(message: string, success: boolean) {
    this.statusMessage = message;
    this.isSuccess = success;
    
    // Auto-hide after 3 seconds
    setTimeout(() => {
      this.statusMessage = '';
    }, 3000);
  }
}