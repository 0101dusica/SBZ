import { Component } from '@angular/core';
import { AuthService } from '../auth.service';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonComponent } from '../../sharedModule/button/button.component';
import { InputFieldComponent } from '../../sharedModule/input-field/input-field.component';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, InputFieldComponent, ButtonComponent, RouterModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent {
  email = '';
  password = '';
  repeatPassword = '';
  firstName = '';
  lastName = '';

  loading: boolean = false;

  constructor(private authService: AuthService, private router: Router) {}

  onRegister() {
    this.loading = true;

    if (!this.areFieldsFilled()) return;
    if (!this.doPasswordsMatch()) return;
  
    this.performRegistration();
  }

  private areFieldsFilled(): boolean {
    const requiredFields = [
      this.email, this.password, this.repeatPassword,
      this.firstName, this.lastName
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

  private doPasswordsMatch(): boolean {
    if (this.password !== this.repeatPassword) {
      Swal.fire({
        title: 'Password mismatch',
        text: 'Passwords do not match. Please check and try again.',
        icon: 'error',
        confirmButtonText: 'OK',
        confirmButtonColor: '#576d2c',
      });
      this.loading = false;
      return false;
    }
    return true;
  }

  private performRegistration(): void {  
    this.authService.register({
      email: this.email,
      password: this.password,
      first_name: this.firstName,
      last_name: this.lastName
    }).subscribe({
      next: () => {
        Swal.fire({
          title: 'Registration successful!',
          text: 'Please check your email to confirm your account.',
          icon: 'success',
          confirmButtonText: 'OK',
          confirmButtonColor: '#576d2c',
        });
        this.loading = false;
        this.router.navigate(['/login']);
      },
      error: err => {
        let errorMsg = 'Registration failed!';
        if (err.error && typeof err.error === 'string') {
          errorMsg = err.error;
        } else if (err.error && err.error.message) {
          errorMsg = err.error.message;
        }
        Swal.fire({
          title: 'Registration Failed!',
          text: errorMsg,
          icon: 'error',
          confirmButtonText: 'OK',
          confirmButtonColor: '#576d2c',
        });
        this.loading = false;
      }
    });
  } 
  
}
