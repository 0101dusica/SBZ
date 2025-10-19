import { Component } from '@angular/core';
import { AuthService } from '../auth.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import Swal from 'sweetalert2';
import { ButtonComponent } from '../../sharedModule/button/button.component';
import { InputFieldComponent } from '../../sharedModule/input-field/input-field.component';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, InputFieldComponent, ButtonComponent, RouterModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  email: string = '';
  password: string = '';

  loading: boolean = false;

  constructor(private authService: AuthService, private router: Router) {}

  onLogin() {
    this.loading = true;

    if (!this.areFieldsFilled()) return;
    this.performLogin();
  }


  private areFieldsFilled(): boolean {
      const requiredFields = [
        this.email, this.password
      ];
      console.log('Field values:', requiredFields);
      
      const allFilled = requiredFields.every(field => field.trim() !== '');
    
      if (!allFilled) {
        Swal.fire({
          title: 'Invalid input',
          text: 'Please fill in all required fields correctly.',
          icon: 'warning',
          confirmButtonColor: '#e9d27b'
        });
        this.loading = false;
        return false;
      }
    
      return true;
    }

  private performLogin(): void {  
    this.authService.login(this.email, this.password).subscribe({
      next: () => {
        Swal.fire({
          title: 'Success!',
          text: `Your login was successful!`,
          icon: 'success',
          confirmButtonText: 'OK',
          confirmButtonColor: '#576d2c',
          showConfirmButton: true,
          timer: 3000,
        });
        this.loading = false;
        this.router.navigate(['/dashboard']);
      },
      error: err => {
        Swal.fire({
          title: 'Login Failed',
          text: 'Please fill out all fields correctly.',
          icon: 'error',
          confirmButtonText: 'OK',
          confirmButtonColor: '#576d2c',
  
        });
        console.error(err);
        
        this.loading = false;
      }
    });
  }

}
