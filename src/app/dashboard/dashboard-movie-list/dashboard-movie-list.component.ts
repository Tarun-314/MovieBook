import { Component, AfterViewChecked, OnInit, OnDestroy } from '@angular/core';
import { BookingDetails, TheatreMovieWithName, UMovie, UTheatre, UserWithBookingCount } from '../../models/dashboard-model';
import { DashboardService } from '../../services/dashboard-services';
import { finalize } from 'rxjs';
import { FormBuilder, FormGroup, NgForm } from '@angular/forms';
import { Bookings, DataTransferObject, LinkedMovies, Movie, Multiplex, User } from '../../models/data-model';

declare var $: any;

@Component({
  selector: 'app-dashboard-movie-list',
  templateUrl: './dashboard-movie-list.component.html',
  styleUrl: './dashboard-movie-list.component.css'
})
export class DashboardMovieListComponent implements AfterViewChecked, OnInit, OnDestroy{
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
  isLoading:boolean=true;

  private showCrudModal(message: string,name: string): void {
    this.crudMessage = message;
    this.tableName = name;
    $('.toast').toast('show');
    $('.toast-backdrop').show();

    $('.toast').on('hidden.bs.toast', function () {
      $('.toast-backdrop').hide();
    });
  }

  MovieButtonClick(form:NgForm) {
    if (this.isMovieEmpty) {
      this.addMovie(form);
    } else {
      this.UpdateMmovie(form);
    }
  }

  ngOnInit() {   
    this.GetMovies();
  }

  ngAfterViewChecked() {
    if (this.moviesLoaded) {
      this.initializeDataTable('#Table2');
      this.moviesLoaded = false;
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

  LinkMmovie(movie:UMovie){
    this.Mmovie={...movie};
    this.isMovieEmpty=false;
  }

  UnLinkMmovie(){
    this.Mmovie=new UMovie();
    this.isMovieEmpty=true;
  }

  UpdateMmovie(form:NgForm){
    
    this.service.updateMovie(this.Mmovie).pipe(
      finalize(() => {
        this.GetMovies(); // This will always be executed
        form.reset();
      })
      ).subscribe({
        next:(response:DataTransferObject)=>{
        this.showCrudModal('Updated movie Details','Movie List');
      },
      error:(msg)=>{
        this.showCrudModal('Failed to update Movie','Movie List');
        form.reset();
      }
    })
   
  }

  GetMovies(){
    this.service.getAllMovies().subscribe({
      next:(data: UMovie[]) => {
        if ($.fn.DataTable.isDataTable('#Table2')) {
          var table = $('#Table2').DataTable();
          table.clear().destroy();
      }
        this.movies = data;
        this.moviesLoaded=true;
        this.isLoading=false;
      },
      error:(error) => {
        console.error('Error fetching movies:', error);
        this.isLoading=false;
      }
    });
  }

  DeleteMovie(movieId: string): void {
    alert("in delete function");
    this.service.deleteMovie(movieId).pipe(
      finalize(() => {
        this.GetMovies();
      })
    ).subscribe({
      next:(response:DataTransferObject) => {
      console.log('Movie deleted:', response);
      this.showCrudModal('Successfully Deleted Movie','Movie List');
     },error:(error) => {
      this.showCrudModal('Error occured while deleting Movie','Movie List');
      
    }});
  }

  addMovie(form:NgForm): void {
    this.service.insertMovie(this.Mmovie).pipe(
      finalize(() => {
        this.GetMovies();
      })
    ).subscribe({
      next: (response:DataTransferObject) => {
        console.log('Movie inserted:', response);
        this.showCrudModal('Added Movie Successfully','Movie List');
        form.reset();
      },
      error: (err) => {
        this.showCrudModal('Error occured while adding movie','Movie List');
        form.reset();
      }
    });
  }

  ngOnDestroy(): void {
    $('.modal').modal('hide');
    $('.modal-backdrop').remove();
    $('body').removeClass('modal-open');
  } 
}
