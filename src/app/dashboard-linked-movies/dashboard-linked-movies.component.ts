import { Component, AfterViewChecked, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { BookingDetails, TheatreMovieWithName, UMovie, UTheatre, UserWithBookingCount } from '../models/dashboard-model';
import { DashboardService } from '../services/dashboard-services';
import { finalize } from 'rxjs';
import { FormBuilder, FormGroup, NgForm } from '@angular/forms';
import { Bookings, DataTransferObject, LinkedMovies, Movie, Multiplex, User } from '../models/data-model';
import { DataService } from '../services/data-services';

declare var $: any;

@Component({
  selector: 'app-dashboard-linked-movies',
  templateUrl: './dashboard-linked-movies.component.html',
  styleUrl: './dashboard-linked-movies.component.css'
})
export class DashboardLinkedMoviesComponent implements AfterViewChecked, OnInit, OnDestroy{
  crudMessage: string = '';
  constructor(private service:DashboardService, private dataService:DataService){}
  
  Mmultiplex:UTheatre=new UTheatre();
  selectedMultiplexes:UTheatre[]=[];
  isMultiplexEmpty: boolean = true;
  Mmovie:UMovie=new UMovie();
  isMovieEmpty: boolean = true;
  Mlinkedmovie:TheatreMovieWithName=new TheatreMovieWithName();
  isLinkedMoveEmpty: boolean = true;
  multiplexes:UTheatre[]=[];
  movies:UMovie[]=[];
  linkedMovies:TheatreMovieWithName[]=[];
  selectedlinkedMovies:TheatreMovieWithName[]=[];
  users:UserWithBookingCount[]=[];
  BookingHistory:BookingDetails[]=[];
  // Flags to check if data has been loaded
  multiplexesLoaded: boolean = false;
  moviesLoaded: boolean = false;
  linkedMoviesLoaded: boolean = false;
  usersLoaded: boolean = false;
  bookingLoaded:boolean=false;
  tableName:string='';
  selectedCity:string='';

  private showCrudModal(message: string,name: string): void {
    this.crudMessage = message;
    this.tableName = name;
    $('.toast').toast('show');
    $('.toast-backdrop').show();

    $('.toast').on('hidden.bs.toast', function () {
      $('.toast-backdrop').hide();
    });
  }

  LinkedMovieButtonClick(form:NgForm) {
    if (this.isLinkedMoveEmpty) {
      this.addTheatreMovie(form);
    } else {
      this.UpdateMlinkedmovie(form);
    }
  }
  

  ngOnInit(){  
    this.GetLinkedMovies();
    this.GetMovies();
    this.GetTheatres(); 

    this.dataService.selectedCity$.subscribe(city =>{
      this.selectedCity=city;
      this.selectedMultiplexes = this.multiplexes.filter(multiplex => multiplex.area === this.selectedCity);
      this.selectedlinkedMovies = this.linkedMovies.filter(multiplex => multiplex.area === this.selectedCity);
    });
  }

  ngAfterViewChecked(){
    if (this.linkedMoviesLoaded) {
      this.initializeDataTable('#Table3');
      this.linkedMoviesLoaded = false;
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

  LinkMlinkedmovie(linkedMovie:TheatreMovieWithName){
    this.Mlinkedmovie={...linkedMovie};
    this.isLinkedMoveEmpty=false;
  }

  UnLinkMlinkedmovie(){
    this.Mlinkedmovie=new TheatreMovieWithName();
    this.isLinkedMoveEmpty=true;
  }

  UpdateMlinkedmovie(form:NgForm){
    this.service.updateTheatreMovie(this.Mlinkedmovie).pipe(
      finalize(() => {
        this.GetLinkedMovies();
        
      })
      ).subscribe({
        next:(response:DataTransferObject)=>{
          this.showCrudModal('Updated Linked Movies Table','Linked Movies');
          form.reset();
        },
      error:(msg)=>{
        this.showCrudModal('Error while updating Details','Linked Movies');
        form.reset();
      }
    })
  }

  GetTheatres(){
    this.service.getAllTheaters().subscribe({
      next:(data: UTheatre[]) => {
        this.multiplexes = data;
        this.multiplexesLoaded=true;
        this.selectedMultiplexes = this.multiplexes.filter(multiplex => multiplex.area === this.selectedCity);
      },
      error:(error) => {
        console.error('Error fetching theaters:', error);
      }
    });
  }

  GetMovies(){
    this.service.getAllMovies().subscribe({
      next:(data: UMovie[]) => {
        this.movies = data;
        this.moviesLoaded=true;
      },
      error:(error) => {
        console.error('Error fetching movies:', error);
      }
    });
  }

  GetLinkedMovies(){
    this.service.getAllTheatreMovies().subscribe({
      next:(data: TheatreMovieWithName[]) => {
        if ($.fn.DataTable.isDataTable('#Table3')) {
          var table = $('#Table3').DataTable();
          table.clear().destroy();
      }
        this.linkedMovies = data;
        this.linkedMoviesLoaded=true;
        this.selectedlinkedMovies = this.linkedMovies.filter(multiplex => multiplex.area === this.selectedCity);
      },
      error:(error) => {
        console.error('Error fetching theatre movies:', error);
      }
    });
  }

  DeleteTheatreMovie(theatreMovieId: string): void {
    this.service.deleteTheatreMovie(theatreMovieId).pipe(
      finalize(() => {
        this.GetLinkedMovies();
        
      })
      ).subscribe({
        next:(response:DataTransferObject) => {
          console.log('TheatreMovie deleted:', response);
          this.showCrudModal('Successfully Deleted TheatreMovie','Linked Movies');
    },error:(error) => {
      this.showCrudModal('Error occured while deleting TheatreMovie','Linked Movies');
    }});
  }

  addTheatreMovie(form:NgForm): void {
    this.service.insertTheatreMovie(this.Mlinkedmovie).pipe(
      finalize(() => {
        this.GetLinkedMovies();
        
      })
      ).subscribe({
        next: (response:DataTransferObject) => {
          console.log('TheatreMovie inserted:', response);
          this.showCrudModal('Linked Movie to Theatre Successfully','Linked Movies');
          form.reset();
      },
      error: (err) => {
        this.showCrudModal(err.error.message,'Linked Movies');
        form.reset();
      }
    });
  }

  ngOnDestroy(){
    $('.modal').modal('hide');
    $('.modal-backdrop').remove();
    $('body').removeClass('modal-open');
  }
}
