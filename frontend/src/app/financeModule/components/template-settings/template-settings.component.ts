import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TemplateService, Template } from '../../services/template.service';
import { ButtonComponent } from '../../../sharedModule/button/button.component';

@Component({
  selector: 'app-template-settings',
  standalone: true,
  imports: [CommonModule, FormsModule, ButtonComponent],
  template: `
    <div class="overlay" (click)="closeModal()">
      <div class="modal" (click)="$event.stopPropagation()">
        <div class="modal-header">
          <h2>Personalizuj pravila i pragove</h2>
          <button class="close-btn" (click)="closeModal()">&times;</button>
        </div>

        <div class="modal-content" *ngIf="template">
          <!-- Osnovni pragovi -->
          <div class="settings-section">
            <h3>Pragovi upozorenja</h3>
            
            <div class="setting-item">
              <label>Upozorenje za rad bez pauze:</label>
              <div class="slider-container">
                <input type="range" min="30" max="180" step="5"
                       [(ngModel)]="template.workBreakThreshold">
                <span class="value">{{ template.workBreakThreshold }} min</span>
              </div>
              <p class="description">Kada će sistem poslati upozorenje za dugotrajan rad</p>
            </div>

            <div class="setting-item">
              <label>Prag za zabavu/društvene mreže:</label>
              <div class="slider-container">
                <input type="range" min="15" max="120" step="5"
                       [(ngModel)]="template.entertainmentThreshold">
                <span class="value">{{ template.entertainmentThreshold }} min</span>
              </div>
              <p class="description">Maksimalno vreme pasivnog korišćenja</p>
            </div>

            <div class="setting-item">
              <label>Prag pada koncentracije:</label>
              <div class="slider-container">
                <input type="range" min="10" max="50" step="5"
                       [(ngModel)]="template.focusDropThreshold">
                <span class="value">{{ template.focusDropThreshold }}%</span>
              </div>
              <p class="description">Koliko pad brzine kucanja aktivira upozorenje</p>
            </div>

            <div class="setting-item">
              <label>Prag povećanja grešaka:</label>
              <div class="slider-container">
                <input type="range" min="20" max="80" step="5"
                       [(ngModel)]="template.errorRateThreshold">
                <span class="value">{{ template.errorRateThreshold }}%</span>
              </div>
              <p class="description">Koliko povećanje grešaka aktivira upozorenje</p>
            </div>
          </div>

          <!-- Napredni CEP pragovi -->
          <div class="settings-section">
            <h3>Napredna pravila</h3>
            
            <div class="setting-item">
              <label>Dugotrajni rad bez pauze:</label>
              <div class="slider-container">
                <input type="range" min="60" max="240" step="10"
                       [(ngModel)]="template.noBreakStreakMinutes">
                <span class="value">{{ template.noBreakStreakMinutes }} min</span>
              </div>
            </div>

            <div class="setting-item">
              <label>Multitasking prag (prelazi aplikacija):</label>
              <div class="slider-container">
                <input type="range" min="10" max="60" step="5"
                       [(ngModel)]="template.appSwitchCount">
                <span class="value">{{ template.appSwitchCount }} prelaza</span>
              </div>
            </div>

            <div class="setting-item">
              <label>Pasivno korišćenje (društvene mreže):</label>
              <div class="slider-container">
                <input type="range" min="30" max="240" step="10"
                       [(ngModel)]="template.passiveBingeMinutes">
                <span class="value">{{ template.passiveBingeMinutes }} min</span>
              </div>
            </div>
          </div>

          <!-- Nivoi umora -->
          <div class="settings-section">
            <h3>Reakcije na nivoe umora</h3>
            <p class="section-description">Izaberi na koje nivoe umora sistem treba da reaguje</p>
            
            <div class="tiredness-levels">
              <div class="level-item">
                <label>
                  <input type="checkbox" [(ngModel)]="template.enableLowAction">
                  <span class="level-badge level-low">LOW</span>
                  Blagi umor - kratka pauza
                </label>
              </div>
              
              <div class="level-item">
                <label>
                  <input type="checkbox" [(ngModel)]="template.enableMediumAction">
                  <span class="level-badge level-medium">MED</span>
                  Umeren umor - duža pauza
                </label>
              </div>
              
              <div class="level-item">
                <label>
                  <input type="checkbox" [(ngModel)]="template.enableHighAction">
                  <span class="level-badge level-high">HIGH</span>
                  Visok umor - obavezna pauza
                </label>
              </div>
            </div>
          </div>

          <!-- Ostale opcije -->
          <div class="settings-section">
            <h3>Ostale opcije</h3>
            
            <div class="setting-item">
              <label class="checkbox-label">
                <input type="checkbox" [(ngModel)]="template.combineDevices">
                Kombinuj vreme računar + telefon
              </label>
              <p class="description">Da li da sabira vreme provedeno na svim uređajima</p>
            </div>
          </div>
        </div>

        <div class="modal-footer">
          <app-button 
            (click)="resetToDefault()" 
            variant="outline"
            label="Reset na podrazumevano">
          </app-button>
          
          <div class="action-buttons">
            <app-button 
              (click)="closeModal()" 
              variant="outline"
              label="Otkaži">
            </app-button>
            <app-button 
              (click)="saveTemplate()" 
              [disabled]="isSaving"
              [label]="isSaving ? 'Čuva...' : 'Sačuvaj'">
            </app-button>
          </div>
        </div>
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

    .modal {
      background: white;
      border-radius: 12px;
      width: 90%;
      max-width: 700px;
      max-height: 90vh;
      display: flex;
      flex-direction: column;
      box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
    }

    .modal-header {
      padding: 1.5rem;
      border-bottom: 1px solid #eee;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .modal-header h2 {
      margin: 0;
      color: #333;
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

    .modal-content {
      padding: 1.5rem;
      overflow-y: auto;
      flex: 1;
    }

    .settings-section {
      margin-bottom: 2rem;
      padding-bottom: 1.5rem;
      border-bottom: 1px solid #f0f0f0;
    }

    .settings-section:last-child {
      border-bottom: none;
    }

    .settings-section h3 {
      margin: 0 0 1rem 0;
      color: #333;
      font-size: 1.2rem;
    }

    .section-description {
      color: #666;
      font-size: 0.9rem;
      margin-bottom: 1rem;
    }

    .setting-item {
      margin-bottom: 1.5rem;
    }

    .setting-item label {
      display: block;
      font-weight: 500;
      margin-bottom: 0.5rem;
      color: #333;
    }

    .slider-container {
      display: flex;
      align-items: center;
      gap: 1rem;
    }

    .slider-container input[type="range"] {
      flex: 1;
      height: 6px;
      border-radius: 3px;
      background: #ddd;
      outline: none;
      -webkit-appearance: none;
    }

    .slider-container input[type="range"]::-webkit-slider-thumb {
      -webkit-appearance: none;
      width: 20px;
      height: 20px;
      border-radius: 50%;
      background: #7B904B;
      cursor: pointer;
    }

    .slider-container .value {
      min-width: 80px;
      text-align: right;
      font-weight: 500;
      color: #7B904B;
    }

    .description {
      margin: 0.5rem 0 0 0;
      font-size: 0.85rem;
      color: #666;
    }

    .tiredness-levels {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .level-item {
      display: flex;
      align-items: center;
    }

    .level-item label {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      margin: 0;
      cursor: pointer;
      font-weight: normal;
    }

    .level-badge {
      width: 30px;
      height: 30px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      font-weight: bold;
      font-size: 0.9rem;
    }

    .level-low { background: #4caf50; }
    .level-medium { background: #ff9800; }
    .level-high { background: #f44336; }

    .checkbox-label {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      cursor: pointer;
    }

    .modal-footer {
      padding: 1.5rem;
      border-top: 1px solid #eee;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .action-buttons {
      display: flex;
      gap: 1rem;
    }

    input[type="checkbox"] {
      width: 18px;
      height: 18px;
      accent-color: #7B904B;
    }

    input[type="range"] {
      accent-color: #7B904B;
    }

    @media (max-width: 768px) {
      .modal {
        width: 95%;
        margin: 1rem;
      }
      
      .modal-footer {
        flex-direction: column;
        gap: 1rem;
      }
      
      .action-buttons {
        width: 100%;
        justify-content: center;
      }
    }
  `]
})
export class TemplateSettingsComponent implements OnInit {
  @Input() userId: number = 1;
  @Output() close = new EventEmitter<void>();
  @Output() templateSaved = new EventEmitter<Template>();

  template: Template | null = null;
  isSaving: boolean = false;

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
        console.log('Template saved successfully:', savedTemplate);
        this.templateSaved.emit(savedTemplate);
        this.closeModal();
      },
      error: (err) => {
        console.error('Error saving template:', err);
        this.isSaving = false;
      }
    });
  }

  resetToDefault() {
    this.templateService.resetToDefault(this.userId).subscribe({
      next: (defaultTemplate) => {
        this.template = defaultTemplate;
        console.log('Reset to default template:', defaultTemplate);
      },
      error: (err) => {
        console.error('Error resetting to default:', err);
      }
    });
  }

  closeModal() {
    this.close.emit();
  }
}