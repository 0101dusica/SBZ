import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-tiredness-overview',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="tiredness-overview">
      <div class="main-card">
        <div class="card-content">
          <p class="label">Rad/Mreža</p>
          <h1 class="amount">{{ workNetworkTime | number:'1.0-2' }}h</h1>
        </div>
      </div>
      <div class="overview-cards">
        <div class="overview-card home-time">
          <p>Provedeno vreme kod kuće</p>
          <h4>{{ homeTime | number:'1.0-2' }}h</h4>
        </div>
        <div class="overview-card symptoms">
          <p>Unos simptoma</p>
          <h4>{{ symptomsCount }}</h4>
        </div>
      </div>
    </div>
  `,
  styleUrl: './budget-overview.component.scss'
})
export class TirednessOverviewComponent {
  @Input() workNetworkTime: number = 0; // sati rada/mreže
  @Input() homeTime: number = 0; // sati kod kuće
  @Input() symptomsCount: number = 0; // broj unetih simptoma
}