import { Component, AfterViewChecked, OnInit, OnDestroy } from '@angular/core';
import { BookingDetails, TheatreMovieWithName, UMovie, UTheatre, UserWithBookingCount } from '../models/dashboard-model';
import { DashboardService } from '../services/dashboard-services';
import { finalize } from 'rxjs';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Bookings, DataTransferObject, LinkedMovies, Movie, Multiplex, User } from '../models/data-model';

declare var $: any;

@Component({
  selector: 'app-dashboard-user-bookings',
  templateUrl: './dashboard-user-bookings.component.html',
  styleUrl: './dashboard-user-bookings.component.css'
})
export class DashboardUserBookingsComponent implements AfterViewChecked, OnInit, OnDestroy{
  crudMessage: string = '';
  constructor(private service:DashboardService){}
  
  Mmultiplex:UTheatre=new UTheatre();
  isMultiplexEmpty: boolean = true;
  Mmovie:UMovie=new UMovie();
  isMovieEmpty: boolean = true;
  Mlinkedmovie:TheatreMovieWithName=new TheatreMovieWithName();
  isLinkedMoveEmpty: boolean = true;
  multiplexes:UTheatre[]=[];
  movies:UMovie[]=[];
  linkedMovies:TheatreMovieWithName[]=[];
  users:UserWithBookingCount[]=[];
  BookingHistory:BookingDetails[]=[];
  // Flags to check if data has been loaded
  multiplexesLoaded: boolean = false;
  moviesLoaded: boolean = false;
  linkedMoviesLoaded: boolean = false;
  usersLoaded: boolean = false;
  bookingLoaded:boolean=false;
  tableName:string='';

  ngOnInit(): void {   
   this.GetBookings();
  }

  ngAfterViewChecked(): void {
    if(this.bookingLoaded){
      this.initializeDataTable('#Table5');
      this.bookingLoaded=false;
    }
  }

  initializeDataTable(tableId: string): void {
    $(tableId).DataTable({
      retrieve: true,
      paging: true,
      searching: true,
      ordering: true,
      info: true,
      lengthChange: true
    });
  }

  GetBookings() {
    this.service.getBookings().subscribe({
      next:(data: BookingDetails[]) => {
        this.BookingHistory = data;
        this.bookingLoaded=true;
      },
      error:(error) => {
        console.error('Error fetching users:', error);
      }
    });
  }
  ngOnDestroy(): void {
    $('.modal').modal('hide');
    $('.modal-backdrop').remove();
    $('body').removeClass('modal-open');
  } 
}
