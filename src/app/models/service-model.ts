// models/theatre-movie-with-name.model.ts
export interface TheatreMovieWithName {
    theatreMovieId: string;
    theatreId: string;
    movieId: string;
    movieName: string;
    theatreName: string;
    screenNumber: number;
    showDate: string; // Use string for DateOnly
    showTimes: string;
    availableSeats: string;
  }
  
  // models/movie-sales.model.ts
  export interface MovieSales {
    movieTitle: string;
    totalSales: number;
  }
  
  // models/movie.model.ts
  export interface Movie {
    id: string;
    title: string;
    likes: number;
    // other properties as needed
  }
  
  export class MovieCollection {
    theatreName: string = ''; // Equivalent to null! in C#
    totalAmount: number = 0; // decimal is treated as number in TypeScript
  }
  
  export class TheatreSales {
    month: number = 0; // int is treated as number in TypeScript
    totalAmount: number = 0; // decimal is treated as number in TypeScript
  }
  