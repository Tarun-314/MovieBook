import { Component, OnInit, ViewChild } from '@angular/core';
import { ChartConfiguration, ChartData, ChartType } from 'chart.js';
import { BaseChartDirective} from 'ng2-charts';
import { MovieStatisticsService } from '../services/statistics-service';
import { UMovie, UTheatre } from '../models/dashboard-model';
import { DashboardService } from '../services/dashboard-services';
import { DataService } from '../services/data-services';
import { MovieCollection, TheatreSales } from '../models/service-model';

@Component({
  selector: 'app-statistics',
  templateUrl: './statistics.component.html',
  styleUrl: './statistics.component.css'
})
export class StatisticsComponent implements OnInit{


  
  constructor(private service:MovieStatisticsService,private services:DashboardService,private dataService:DataService){}
  theatreSales: TheatreSales[] = [];
  selectedMultiplexes:UTheatre[]=[];
  multiplexes:UTheatre[]=[];
  movies:UMovie[]=[];
  none: string="None";
  selectedCity:string='';
  movie:UMovie=null;
  disasterMovie:UMovie=null;
  noMovie:boolean = false;
  noDisasterMovie:boolean = false;
  movieCollections: MovieCollection[] = [];
  monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'
  ];

  @ViewChild(BaseChartDirective) chart: BaseChartDirective<'bar'> | undefined;

  // Bar chart labels and data
  barChartLabels: string[] = ['Label 1', 'Label 2', 'Label 3', 'Label 4'];
  barChartData: ChartData<'bar'> = {
    labels: this.theatreSales.map(sale => this.monthNames[sale.month - 1]), // Get month names
    datasets: [
      { data: this.theatreSales.map(sale => sale.totalAmount), label: 'Sales' }
    ]
  };

// Chart options
barChartOptions: ChartConfiguration<'bar'>['options'] = {
  responsive: true,
  maintainAspectRatio: false,
  scales: {
    x: {},
    y: {
      beginAtZero: true
    }
  }
};

// Pie chart options
pieChartOptions: ChartConfiguration<'pie'>['options'] = {
  responsive: true,
  maintainAspectRatio: false
};

  barChartType = 'bar' as const;
  barChartLegend = true;

  // Example: Method to update the chart
  updateChartData(): void {
    this.barChartData.datasets[0].data= [50, 60, 70, 80]; // Update data dynamically
    if (this.chart) {
      this.chart.update(); // Trigger chart update
    }
  }
  @ViewChild(BaseChartDirective) piechart: BaseChartDirective | undefined;

  // Pie
  public pieChartData: ChartData<'pie', number[], string | string[]> = {
    labels: this.movieCollections.map(collection => collection.theatreName), // Use theatre names as labels
  datasets: [
    {
      data: this.movieCollections.map(collection => collection.totalAmount), // Use total amounts as data
    }
  ]
  };
  public pieChartType= 'pie' as const;

  multiplexId: number;
  week: Date;
  movieId: number;
  month: Date;
  quarter: number;
  year: number;

  // constructor(private movieService: MovieService) { }

  ngOnInit(): void {
    this.GetMovies();
    this.GetTheatres(); 
    this.dataService.selectedCity$.subscribe(city =>{
      this.selectedCity=city;
      this.selectedMultiplexes = this.multiplexes.filter(multiplex => multiplex.area === this.selectedCity);
    });  
  }

  GetTheatres(){
    this.services.getAllTheaters().subscribe({
      next:(data: UTheatre[]) => {
        this.multiplexes = data;
        this.selectedMultiplexes = this.multiplexes.filter(multiplex => multiplex.area === this.selectedCity);
      },
      error:(error) => {
        console.error('Error fetching theaters:', error);
      }
    });
  }

  GetMovies(){
    this.services.getAllMovies().subscribe({
      next:(data: UMovie[]) => {
        this.movies = data;
       
      },
      error:(error) => {
        console.error('Error fetching movies:', error);
      }
    });
  }

   selectMonth(event: Event) {
    const selectElement = event.target as HTMLSelectElement;
    const dateString = selectElement.value;

      this.service.getMovieOfTheMonth(dateString).subscribe({
        next:(data:UMovie)=>{
          console.log(data);
          this.movie=data;
          this.noMovie = false;
        },
        error:(err)=>{
          this.movie=null;
          this.noMovie = true;
        }
      });
      
      this.service.getDisasterOfTheMonth(dateString).subscribe({
        next:(data:UMovie)=>{
          console.log(data);
          this.disasterMovie = data;
          this.noDisasterMovie = false;
        },
        error:(err)=>{
          this.disasterMovie = null;
          this.noDisasterMovie = true;
        }
      })
  }
  GetTheatreStats(event: Event) {
    const selectElement = event.target as HTMLSelectElement;
    const theatreid = selectElement.value;
    this.service.getTheatreStats(theatreid).subscribe({
      next:(data:TheatreSales[])=>{
        this.theatreSales=data;
        this.barChartData.labels=this.theatreSales.map(sale => this.monthNames[sale.month - 1]);
        this.barChartData.datasets[0].data=this.theatreSales.map(sale => sale.totalAmount);
        if (this.chart) {
          this.chart.update(); // Trigger chart update
        }
      },
      error:(err)=>{
       
      }
    })

    }
    GetMovieCollection(event: Event) {
      const selectElement = event.target as HTMLSelectElement;
      const movieid = selectElement.value;
      this.service.getMovieCollections(movieid).subscribe({
        next:(data:MovieCollection[])=>{
          console.log(data)
          this.movieCollections=data;
          const newLabels = this.movieCollections.map(collection => collection.theatreName);
          const newData = this.movieCollections.map(collection => collection.totalAmount);
          const backgroundColors = this.movieCollections.map(() => {
            return this.getRandomColor(); // Generate a random color for each segment
          });
          // Clone the pieChartData object to trigger change detection
          this.pieChartData = {
            ...this.pieChartData, // keep other properties (if any)
            labels: newLabels,
            datasets: [
              {
                ...this.pieChartData.datasets[0], // clone other dataset properties
                data: newData,
                backgroundColor: backgroundColors
              }
            ],
            
          };
          console.log(this.pieChartData);
          if (this.piechart) {
            this.piechart.update();
          }
        },
        error:(err)=>{
         
        }
      })
      }
      getRandomColor(): string {
        const letters = '0123456789ABCDEF';
        let color = '#';
        for (let i = 0; i < 6; i++) {
          color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
      }
  getStar(rating: number): string[] {
    const fullStars = Math.floor(rating);
    const halfStar = rating % 1 >= 0.5 ? 1 : 0;
    const emptyStars = 5 - fullStars - halfStar;
    console.log(emptyStars);
    return [
      ...Array(fullStars).fill('fa-star'),
      ...Array(halfStar).fill('fa-star-half-o'),
      ...Array(emptyStars).fill('fa-star-o')
    ];
  }


  getTotalTicketSales(movieId: number, month: Date): void {
    // Fetch total ticket sales of a movie in a specific month
  }

  getSalesInQuarter(quarter: number, year: number): void {
    // Fetch sales made movie-wise in a quarter
  }

  getMovieOfTheMonth(month: Date): void {
    // Fetch the movie of the month
  }

  getDisasterOfTheMonth(month: Date): void {
    // Fetch the disaster of the month
  }
}
