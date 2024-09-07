import { Component, AfterViewChecked, OnInit, OnDestroy } from '@angular/core';
import { BookingDetails, TheatreMovieWithName, UMovie, UTheatre, UserWithBookingCount } from '../models/dashboard-model';
import { DashboardService } from '../services/dashboard-services';
import { finalize } from 'rxjs';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Bookings, DataTransferObject, LinkedMovies, Movie, Multiplex, User } from '../models/data-model';

declare var $: any;

@Component({
  selector: 'app-dashboard-users',
  templateUrl: './dashboard-users.component.html',
  styleUrl: './dashboard-users.component.css'
})
export class DashboardUsersComponent implements AfterViewChecked, OnInit, OnDestroy{
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

  private showCrudModal(message: string,name: string): void {
    this.crudMessage = message;
    this.tableName = name;
    $('.toast').toast('show');
    $('.toast-backdrop').show();

    $('.toast').on('hidden.bs.toast', function () {
      $('.toast-backdrop').hide();
    });
  }

  toggleUserStatus(selectedUser:UserWithBookingCount): void {
    if (selectedUser.role=='User') {
      this.blockUser(selectedUser.userId);
      selectedUser.role="Block";
    } else {
      this.unblockUser(selectedUser.userId);
      selectedUser.role="User";
    }
  }

  ngOnInit(): void {  
    this.GetUsers();
  }

  ngAfterViewChecked(): void {
    if (this.usersLoaded) {
      this.initializeDataTable('#Table4');
      this.usersLoaded = false;
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

  GetUsers(){
    this.service.getAllUsers().subscribe({
      next:(data: UserWithBookingCount[]) => {
        this.users = data;
        this.usersLoaded=true;
      },
      error:(error) => {
        console.error('Error fetching users:', error);
      }
    });
  }

  blockUser(userId: string): void {
    this.service.blockUser(userId).subscribe({
      next: (response:DataTransferObject) => {
        console.log('User blocked:', response);
        this.showCrudModal('Blocked User Successfully','Users');
      },
      error: (err) => {
        this.showCrudModal('Failed to Block User','Users');
      }
    });
  }

  unblockUser(userId: string): void {
    this.service.unblockUser(userId).subscribe({
      next: (response:DataTransferObject) => {
        console.log('User unblocked:', response);
        this.showCrudModal('UnBlocked User Successfully','Users');
      },
      error: (err) => {
        this.showCrudModal('Failed to UnBlock User','Users');
      }
    });
  }

  deleteUser(userId: string): void {
    this.service.deleteUser(userId).subscribe({
      next: (response:DataTransferObject) => {
        this.GetUsers();
        console.log('User deleted:', response);
        this.showCrudModal('Deleted User','Users');
      },
      error: (err) => {
        this.showCrudModal('Failed to Delete User','Users');
      }
    });
  }

  ngOnDestroy(): void {
    $('.modal').modal('hide');
    $('.modal-backdrop').remove();
    $('body').removeClass('modal-open');
  } 
}
