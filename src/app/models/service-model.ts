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
  