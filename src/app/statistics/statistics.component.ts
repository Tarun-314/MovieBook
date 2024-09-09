import { Component, OnInit, ViewChild } from '@angular/core';
import { ChartConfiguration, ChartData, ChartType } from 'chart.js';
import { BaseChartDirective} from 'ng2-charts';
import { MovieStatisticsService } from '../services/statistics-service';
import { UMovie } from '../models/dashboard-model';

@Component({
  selector: 'app-statistics',
  templateUrl: './statistics.component.html',
  styleUrl: './statistics.component.css'
})
export class StatisticsComponent implements OnInit{
  
  constructor(private service:MovieStatisticsService){}
  none: string="None";
  movierating:number=0;
  disasterrating:number=0;
  moviePoster: string | null = null; // Replace with actual poster URL or null
  disasterPoster: string | null = null; // Replace with actual poster URL or null

  @ViewChild(BaseChartDirective) chart: BaseChartDirective<'bar'> | undefined;

  // Bar chart labels and data
  barChartLabels: string[] = ['Label 1', 'Label 2', 'Label 3', 'Label 4'];
  barChartData: ChartData<'bar'> = {
    labels: ['January', 'February', 'March', 'April'],
    datasets: [
      { data: [6500, 5009, 8000, 8001], label: 'Series A' }
    ]
  };
  // Chart options
  barChartOptions = {
    responsive: true,
    scales: {
      x: {},
      y: {
        beginAtZero: true
      }
    }
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
    labels: [['Download', 'Sales'], ['In', 'Store', 'Sales'], 'Mail Sales'],
    datasets: [
      {
        data: [300, 500, 100],
      },
    ],
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
    // Initialize data fetching here
  }

   selectMonth(event: Event) {
    const selectElement = event.target as HTMLSelectElement;
    const dateString = selectElement.value;

      this.service.getMovieOfTheMonth(dateString).subscribe({
        next:(data:UMovie)=>{
          console.log(data);
          this.moviePoster=data.image;
          this.movierating=data.rating;
        },
        error:(err)=>{
          this.moviePoster=this.none;
        }
      });
      this.service.getDisasterOfTheMonth(dateString).subscribe({
        next:(data:UMovie)=>{
          console.log(data);
          this.disasterPoster=data.image;
          this.disasterrating=data.rating;
        },
        error:(err)=>{
          this.disasterPoster=this.none;
        }
      })
  }
  getStarsmovie(): string[] {
    const fullStars = Math.floor(this.movierating);
    const halfStar = this.movierating % 1 >= 0.5 ? 1 : 0;
    const emptyStars = 5 - fullStars - halfStar;
    console.log(emptyStars);
    return [
      ...Array(fullStars).fill('fa-star'),
      ...Array(halfStar).fill('fa-star-half-o'),
      ...Array(emptyStars).fill('fa-star-o')
    ];
  }
  getStarsdisaster(): string[] {
    const fullStars = Math.floor(this.disasterrating);
    const halfStar = this.disasterrating % 1 >= 0.5 ? 1 : 0;
    const emptyStars = 5 - fullStars - halfStar;

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

