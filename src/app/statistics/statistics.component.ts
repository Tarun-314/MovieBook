import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-statistics',
  templateUrl: './statistics.component.html',
  styleUrl: './statistics.component.css'
})
export class StatisticsComponent implements OnInit{
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

