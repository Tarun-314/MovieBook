import { NgModule } from '@angular/core';

import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { CarouselComponent } from './carousel/carousel.component';
import { FooterComponent } from './footer/footer.component';
import { MultiplexComponent } from './multiplex/multiplex.component';
import { MoviesComponent } from './movies/movies.component';
import { MulDetailsComponent } from './mul-details/mul-details.component';
import { MovDetailsComponent } from './mov-details/mov-details.component';
import { ProfileComponent } from './profile/profile.component';
import { TicketBookingComponent } from './ticket-booking/ticket-booking.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { AboutComponent } from './about/about.component';
import { PrivacyPolicyComponent } from './privacy-policy/privacy-policy.component';
import { ContactComponent } from './contact/contact.component';
import { PaymentComponent } from './payment/payment.component';
import { ErrorComponent } from './error/error.component';
import { LoginComponent } from './login/login.component';
import { HomeComponent } from './home/home.component';
import { ConfirmBookingComponent } from './confirm-booking/confirm-booking.component';
import { LikesPipe } from './pipes/likes.pipe';
import { TruncatePipe } from './pipes/truncate.pipe';
import { ShowTimesPipe } from './pipes/show-times.pipe';
import { HttpClient, HttpClientModule, provideHttpClient } from '@angular/common/http';
import { AlertComponent } from './alert/alert.component';
import { LoadingSpinnerComponent } from './loading-spinner/loading-spinner.component';
import { StatisticsComponent } from './statistics/statistics.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { DashboardMovieListComponent } from './dashboard-movie-list/dashboard-movie-list.component';
import { DashboardLinkedMoviesComponent } from './dashboard-linked-movies/dashboard-linked-movies.component';
import { DashboardUsersComponent } from './dashboard-users/dashboard-users.component';
import { DashboardUserBookingsComponent } from './dashboard-user-bookings/dashboard-user-bookings.component';
import { DashboardMultiplexListComponent } from './dashboard-multiplex-list/dashboard-multiplex-list.component';


@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    CarouselComponent,
    FooterComponent,
    MultiplexComponent,
    MoviesComponent,
    MulDetailsComponent,
    MovDetailsComponent,
    ProfileComponent,
    TicketBookingComponent,
    DashboardComponent,
    AboutComponent,
    PrivacyPolicyComponent,
    ContactComponent,
    PaymentComponent,
    ErrorComponent,
    LoginComponent,
    HomeComponent,
    ConfirmBookingComponent,
    LikesPipe,
    TruncatePipe,
    ShowTimesPipe,
    AlertComponent,
    LoadingSpinnerComponent,
    StatisticsComponent,
    ForgotPasswordComponent,
    DashboardMultiplexListComponent,
    DashboardMovieListComponent,
    DashboardLinkedMoviesComponent,
    DashboardUsersComponent,
    DashboardUserBookingsComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule, 
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
