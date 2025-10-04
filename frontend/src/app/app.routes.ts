import { Routes } from '@angular/router';
import { LoginComponent } from './authModule/login/login.component';
import { RegisterComponent } from './authModule/register/register.component';
import { UserDetailComponent } from './userModule/user-detail/user-detail.component';
import { DashboardComponent } from './financeModule/dashboard/dashboard.component';
import { authGuard } from './authModule/guards/auth.guard';
import { authRequiredGuard } from './authModule/guards/auth-required-guard.guard';

export const routes: Routes = [
  { path: 'login', component: LoginComponent, canActivate: [authGuard] },
  { path: 'register', component: RegisterComponent, canActivate: [authGuard] },
  // { path: 'dashboard', component: DashboardComponent, canActivate: [authRequiredGuard] },
  { path: 'dashboard', component: DashboardComponent },
  {
    path: 'manage-account',
    component: UserDetailComponent,
    canActivate: [authRequiredGuard],
  },
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: '**', redirectTo: '/login' },
];
