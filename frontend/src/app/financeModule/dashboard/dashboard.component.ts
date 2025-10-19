import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { TirednessOverviewComponent } from '../components/budget-overview/budget-overview.component';
import { AddEventComponent } from '../components/add-transaction/add-transaction.component';
import { EventHistoryComponent } from '../components/transaction-history/transaction-history.component';
import { ButtonComponent } from '../../sharedModule/button/button.component';
import { BalanceService, UserBalance } from '../services/balance.service';
import Swal from 'sweetalert2';

interface BudgetData {
  budgetLeft: number;
  totalBudget: number;
  totalExpense: number;
}

interface DisplayBalance {
  availableBalance: number;
  totalIncome: number;
  totalExpenses: number;
  activeBudgetsTotal: number;
  unallocatedFunds: number;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule, 
    RouterModule, 
    FormsModule,
  TirednessOverviewComponent,
  AddEventComponent,
  EventHistoryComponent,
    ButtonComponent
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit {
  // ...existing code...
  
  // Digital tiredness data
  workNetworkTime: number = 0; // sati rada/mreže
  homeTime: number = 0; // sati kod kuće
  symptomsCount: number = 0; // broj unetih simptoma

  isLoadingOverview = false;
  events: any[] = []; // istorija događaja/simptoma

  userName: string = 'User'; // TODO: Get from auth service

  constructor() {}

  ngOnInit() {
    this.loadOverviewData();
    // TODO: Load events (symptoms, activities, etc.)
  }

  loadOverviewData() {
    this.isLoadingOverview = true;
    // TODO: Pozvati API za overview podatke
    // Primer: this.workNetworkTime = ...; this.homeTime = ...; this.symptomsCount = ...;
    this.isLoadingOverview = false;
  }

  onEventAdded(eventData: any) {
    // TODO: Implement event/symptom/activity add logic
    // Ova funkcija će biti pozivana kada se doda novi simptom ili događaj
    // Primer: this.loadOverviewData(); this.refreshEvents();
    // Swal.fire({ title: 'Uspeh!', text: 'Događaj dodat', icon: 'success', timer: 2000, showConfirmButton: false });
  }

  onEditRequested(event: any) {
    // TODO: Implement edit event/symptom/activity
    Swal.fire({
      title: 'Izmena događaja',
      text: 'Izmena će biti omogućena uskoro',
      icon: 'info'
    });
  }

  onDeleteRequested(event: any) {
    Swal.fire({
      title: 'Da li ste sigurni?',
      text: 'Želite da obrišete ovaj događaj?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#576d2c',
      cancelButtonColor: '#636e72',
      confirmButtonText: 'Da, obriši!'
    }).then((result) => {
      if (result.isConfirmed) {
        // TODO: Implement delete API call
        // this.loadOverviewData(); this.refreshEvents();
        Swal.fire({
          title: 'Info',
          text: 'Brisanje će biti omogućeno uskoro.',
          icon: 'info',
          timer: 2000,
          showConfirmButton: false
        });
      }
    });
  }

  onAnalyticsOpened() {
    // TODO: Implement navigation to analytics
    Swal.fire({
      title: 'Analitika',
      text: 'Stranica za analitiku će biti omogućena uskoro',
      icon: 'info'
    });
  }
}