import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-button',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.scss']
})
export class ButtonComponent {
  @Input() label: string = '';
  @Input() variant: 'primary' | 'outline' | 'icon' = 'primary';
  @Input() size: 'small' | 'medium' | 'large' = 'medium';
  @Input() loading: boolean = false;
  @Input() disabled: boolean = false;
  @Input() routerLink?: string | string[];

  @Output() submit = new EventEmitter<void>();

  onClick() {
    if (!this.loading && !this.disabled) {
      this.submit.emit();
    }
  }
}
