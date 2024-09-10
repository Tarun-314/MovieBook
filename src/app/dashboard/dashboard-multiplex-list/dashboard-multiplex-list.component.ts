import { Component, AfterViewChecked, OnInit, OnDestroy } from '@angular/core';
import { BookingDetails, TheatreMovieWithName, UMovie, UTheatre, UserWithBookingCount } from '../../models/dashboard-model';
import { DashboardService } from '../../services/dashboard-services';
import { finalize } from 'rxjs';
import { FormBuilder, FormGroup, NgForm } from '@angular/forms';
import { Bookings, DataTransferObject, LinkedMovies, Movie, Multiplex, User } from '../../models/data-model';
import { DataService } from '../../services/data-services';

declare var $: any;

@Component({
  selector: 'app-dashboard-multiplex-list',
  templateUrl: './dashboard-multiplex-list.component.html',
  styleUrl: './dashboard-multiplex-list.component.css'
})
export class DashboardMultiplexListComponent implements AfterViewChecked, OnInit, OnDestroy{
  crudMessage: string = '';
  isLoading:boolean = true;
  constructor(private service:DashboardService, private dataService:DataService){}
  
  Mmultiplex:UTheatre=new UTheatre();
  isMultiplexEmpty: boolean = true;
  Mmovie:UMovie=new UMovie();
  isMovieEmpty: boolean = true;
  Mlinkedmovie:TheatreMovieWithName=new TheatreMovieWithName();
  isLinkedMoveEmpty: boolean = true;
  multiplexes:UTheatre[]=[];
  selectedMultiplexes:UTheatre[]=[];
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

  MultiplexButtonClick(form:NgForm) {
    if (this.isMultiplexEmpty) {
      this.addTheatre(form);
    } else {
      this.UpdateMmultiplex(form);
    }
  }

  ngOnInit(): void { 
    this.GetTheatres();

    this.dataService.selectedCity$.subscribe(city =>{
      this.selectedCity=city;
      this.selectedMultiplexes = this.multiplexes.filter(mul => mul.area == this.selectedCity);
    });
  }

  ngAfterViewChecked(): void {
    if (this.multiplexesLoaded) {
      this.initializeDataTable('#Table');
      this.multiplexesLoaded = false;
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

  LinkMmultiplex(multiplex:UTheatre){
    this.Mmultiplex={...multiplex};
    this.isMultiplexEmpty=false;
  }

  UnLinkMmultiplex(){
    this.Mmultiplex=new UTheatre();
    this.isMultiplexEmpty=true;
    this.Mmultiplex.area=this.selectedCity;
  }

  GetTheatres(){
    this.service.getAllTheaters().subscribe({
      next:(data: UTheatre[]) => {
        if ($.fn.DataTable.isDataTable('#Table')) {
          var table = $('#Table').DataTable();
          table.clear().destroy();
      }
        this.multiplexes = data;
        this.selectedMultiplexes = this.multiplexes.filter(mul => mul.area == this.selectedCity);
        this.multiplexesLoaded=true;
        this.isLoading=false;
      },
      error:(error) => {
        console.error('Error fetching theaters:', error);
        this.isLoading=false;
      }
    });
  }

  addTheatre(form:NgForm): void {
    this.service.insertTheatre(this.Mmultiplex).pipe(
      finalize(() => {
        this.GetTheatres();
      })
    ).subscribe({
      next: (response:DataTransferObject) => {
        console.log('Theatre inserted:', response);
        this.showCrudModal('Added Theatre Successfully','Multiplex List');
        form.reset();
      },
      error: (err) => {
        this.showCrudModal('Error occured while adding Theatre','Multiplex List');
        form.reset();
      }
    });
  }

  UpdateMmultiplex(form:NgForm){
    this.service.updateTheatre(this.Mmultiplex).pipe(
      finalize(() => {
        this.GetTheatres();
        this.showCrudModal('Multiplex updated successfully','Multiplex List');
        form.reset();
      })
    ).subscribe({
      next:(response:DataTransferObject)=>{

      },
      error:(msg)=>{
        this.showCrudModal('Failed to update multiplex','Multiplex List');
        form.reset();
      }
    });
  }

  DeleteTheatre(theatreId: string): void {
    this.service.deleteTheatre(theatreId).pipe(
      finalize(() => {
        this.GetTheatres();
      })
    ).subscribe({
      next:(response:DataTransferObject) => {
      console.log('Theatre deleted:', response);
      this.showCrudModal('Successfully Deleted Theatre','Multiplex List');
    }, error:(error) => {
      this.showCrudModal('Error occured while deleting Theatre','Multiplex List');
    }});
  }

  ngOnDestroy(): void {
    $('.modal').modal('hide');
    $('.modal-backdrop').remove();
    $('body').removeClass('modal-open');
  }
}
