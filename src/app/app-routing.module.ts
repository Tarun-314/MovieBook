import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AboutComponent } from './about/about.component';
import { ContactComponent } from './contact/contact.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ErrorComponent } from './error/error.component';
import { MovDetailsComponent } from './mov-details/mov-details.component';
import { MulDetailsComponent } from './mul-details/mul-details.component';
import { PaymentComponent } from './payment/payment.component';
import { PrivacyPolicyComponent } from './privacy-policy/privacy-policy.component';
import { ProfileComponent } from './profile/profile.component';
import { TicketBookingComponent } from './ticket-booking/ticket-booking.component';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { ConfirmBookingComponent } from './confirm-booking/confirm-booking.component';
import { FormsModule } from '@angular/forms';
import { IdGuard } from './guards/IdGuard';
import { StatisticsComponent } from './statistics/statistics.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { AuthGuard } from './guards/AuthGuard';
import { DashboardMultiplexListComponent } from './dashboard-multiplex-list/dashboard-multiplex-list.component';
import { DashboardMovieListComponent } from './dashboard-movie-list/dashboard-movie-list.component';
import { DashboardLinkedMoviesComponent } from './dashboard-linked-movies/dashboard-linked-movies.component';
import { DashboardUsersComponent } from './dashboard-users/dashboard-users.component';
import { DashboardUserBookingsComponent } from './dashboard-user-bookings/dashboard-user-bookings.component';
import { AdminGuard } from './guards/AdminGuard';

const routes: Routes = [
  {path: 'home',component: HomeComponent, canActivate:[AuthGuard]},
  {path: 'auth',component: LoginComponent},
  {path: 'forgot',component: ForgotPasswordComponent},
  { path: 'mul-details/:id', component: MulDetailsComponent, canActivate:[IdGuard, AuthGuard] },
  { path: 'mov-details/:id', component: MovDetailsComponent, canActivate:[IdGuard, AuthGuard] },
  { path: 'ticket-booking/:id', component: TicketBookingComponent, canActivate:[IdGuard, AuthGuard]  },
  { path: 'ticket-confirm', component: ConfirmBookingComponent, canActivate:[AuthGuard] },
  { path: 'profile', component: ProfileComponent, canActivate:[AuthGuard] },
  { path: 'dashboard', component: DashboardComponent, canActivate:[AuthGuard, AdminGuard], children: [
    { path: '', redirectTo: 'multiplex-list', pathMatch: 'full' }, 
    { path: 'multiplex-list', component: DashboardMultiplexListComponent },
    { path: 'movie-list', component: DashboardMovieListComponent },
    { path: 'linked-movies', component: DashboardLinkedMoviesComponent },
    { path: 'users', component: DashboardUsersComponent },
    { path: 'user-bookings', component: DashboardUserBookingsComponent }
  ]} ,

  { path: 'payment', component: PaymentComponent, canActivate:[AuthGuard] },
  { path: 'about', component: AboutComponent, canActivate:[AuthGuard] },
  { path: 'contact', component: ContactComponent },
  { path: 'privacy-policy', component: PrivacyPolicyComponent, canActivate:[AuthGuard]},
  { path: 'error', component: ErrorComponent },
  { path: 'statistics', component: StatisticsComponent, canActivate:[AuthGuard, AdminGuard]},
  { path: '', redirectTo: 'home', pathMatch: 'full' }, 
  { path: '**', component: ErrorComponent }
];


@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule,FormsModule]
})
export class AppRoutingModule { }
