import { Component, AfterViewChecked, OnInit, OnDestroy } from '@angular/core';
import { BookingDetails, TheatreMovieWithName, UMovie, UTheatre, UserWithBookingCount } from '../models/dashboard-model';
import { DashboardService } from '../services/dashboard-services';
import { finalize } from 'rxjs';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Bookings, DataTransferObject, LinkedMovies, Movie, Multiplex, User } from '../models/data-model';

declare var $: any;

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})

export class DashboardComponent  {
}