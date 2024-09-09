import { Component, OnInit, ViewChild } from '@angular/core';
import { ChartData } from 'chart.js';
import { BaseChartDirective} from 'ng2-charts';

@Component({
  selector: 'app-statistics',
  templateUrl: './statistics.component.html',
  styleUrl: './statistics.component.css'
})
export class StatisticsComponent implements OnInit{

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

  getMoviesInWeek(multiplexId: number, week: Date): void {
    // Fetch movies in a week for a specific multiplex
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

