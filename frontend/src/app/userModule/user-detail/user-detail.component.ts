import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
import { AuthService } from '../../authModule/auth.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { ButtonComponent } from '../../sharedModule/button/button.component';
import { InputFieldComponent } from '../../sharedModule/input-field/input-field.component';
import { UserService } from '../user.service';
import { User } from '../user.model';

@Component({
  selector: 'app-user-detail',
  imports: [CommonModule, FormsModule, RouterModule, InputFieldComponent, ButtonComponent],
  templateUrl: './user-detail.component.html',
  styleUrl: './user-detail.component.scss'
})
export class UserDetailComponent implements OnInit {
  email = '';
  firstName = '';
  lastName = '';
  phoneNumber = '';
  dateOfBirth: string = '';
  gender: number = 0;

  loading: boolean = false;

  constructor(private userService: UserService, private router: Router) {}

  ngOnInit() {
    this.userService.getCurrentUser().subscribe({
      next: user => {
        this.email = user.email;
        this.firstName = user.firstName;
        this.lastName = user.lastName;
        this.phoneNumber = user.phoneNumber;
        this.dateOfBirth = this.formatDateForInput(user.dateOfBirth);
        this.gender = user.gender;
      }
    });
  }

  formatDateForInput(date: string | Date): string {
    const d = new Date(date);
    const month = ('0' + (d.getMonth() + 1)).slice(-2);
    const day = ('0' + d.getDate()).slice(-2);
    return `${d.getFullYear()}-${month}-${day}`;
  }

  onSaveChanges() {
    this.loading = true;
  
    if (!this.areFieldsFilled() || !this.isPhoneNumberValid()) return;
  
    const updatedUser: User = {
      email: this.email,
      firstName: this.firstName,
      lastName: this.lastName,
      phoneNumber: this.phoneNumber,
      dateOfBirth: this.dateOfBirth,
      gender: this.gender
    };
  
    this.userService.updateUser(updatedUser).subscribe({
      next: () => {
        this.loading = false;
        Swal.fire({
          title: 'Data Updated!',
          text: 'Your data has been updated.',
          icon: 'success',
          showConfirmButton: false,
          confirmButtonText: 'OK',
          confirmButtonColor: '#576d2c',
          timer: 3000,
          timerProgressBar: true,
          didClose: () => {
            this.router.navigate(['/workouts']);
          }
        });
      },
      error: () => {
        this.loading = false;       
        Swal.fire({
          title: 'Error!',
          text: 'Failed to update data. Please try again.',
          icon: 'error',
          showConfirmButton: false,
          confirmButtonText: 'OK',
          confirmButtonColor: '#576d2c'
        });  
      }
    });
  }
  

  private areFieldsFilled(): boolean {
    const requiredFields = [
      this.email, this.firstName, this.lastName,
      this.phoneNumber, this.dateOfBirth
    ];

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

  private isPhoneNumberValid(): boolean {
    const phoneRegex = /^\+?[0-9]+$/;

    if (!phoneRegex.test(this.phoneNumber)) {
      Swal.fire({
        title: 'Invalid phone number',
        text: 'Phone number must contain only digits and may optionally start with +.',
        icon: 'warning',
        confirmButtonText: 'OK',
        confirmButtonColor: '#e9d27b',
      });
      this.loading = false;
      return false;
    }
    return true;
  }
  
}
