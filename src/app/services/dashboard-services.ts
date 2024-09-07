import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BookingDetails, TheatreMovieWithName, UMovie, UTheatre, UserWithBookingCount } from '../models/dashboard-model';
import { DataTransferObject } from '../models/data-model';
import { DataService } from './data-services';

@Injectable({providedIn:'root'})
export class DashboardService{
    private token ;
    constructor(private http: HttpClient, private dataService: DataService) { 
      this.token = this.dataService.getUserDetails().token;
    }
   
    private baseUrl = 'https://localhost:7263/Admin';
    
    private getHeaders(): HttpHeaders {
        return new HttpHeaders({
          'Authorization': `Bearer ${this.token}`,
          'Content-Type': 'application/json'
        });
      }

    // Function to get all theaters
    public getAllTheaters(): Observable<UTheatre[]> {
      return this.http.get<UTheatre[]>(`${this.baseUrl}/AllTheaters`, {
        headers: this.getHeaders()
      });
    }
  
    // Function to get all movies
    public getAllMovies(): Observable<UMovie[]> {
      return this.http.get<UMovie[]>(`${this.baseUrl}/AllMovies`, {
        headers: this.getHeaders()
      });
    }
  
    // Function to get all theater movies with names
    public getAllTheatreMovies(): Observable<TheatreMovieWithName[]> {
      return this.http.get<TheatreMovieWithName[]>(`${this.baseUrl}/GetAllTheatreMovies`, {
        headers: this.getHeaders()
      });
    }
  
    // Function to get all users with booking count
    public getAllUsers(): Observable<UserWithBookingCount[]> {
      return this.http.get<UserWithBookingCount[]>(`${this.baseUrl}/GetAllUsers`, {
        headers: this.getHeaders()
      });
    }

    getBookings(): Observable<BookingDetails[]> {
      return this.http.get<BookingDetails[]>(`${this.baseUrl}/GetAllBookings`, {
        headers: this.getHeaders()
      });
    }

    // Function to update a movie
    public updateMovie(updatedMovie: UMovie): Observable<DataTransferObject> {
      return this.http.put<DataTransferObject>(`${this.baseUrl}/UpdateMovie`, updatedMovie, {
        headers: this.getHeaders()
      });
    }

    // Function to update a theatre
    public updateTheatre(updatedTheatre: UTheatre): Observable<DataTransferObject> {
      return this.http.put<DataTransferObject>(`${this.baseUrl}/UpdateTheatre`, updatedTheatre, {
        headers: this.getHeaders()
      });
    }

    // Function to update a theatre movie
    public updateTheatreMovie(updatedTheatreMovie: TheatreMovieWithName): Observable<DataTransferObject> {
      return this.http.put<DataTransferObject>(`${this.baseUrl}/UpdateTheatreMovie`, updatedTheatreMovie, {
        headers: this.getHeaders()
      });
    }
    deleteMovie(movieId: string): Observable<DataTransferObject> {
      const url = `${this.baseUrl}/DeleteMovie/${movieId}`;
      return this.http.delete<DataTransferObject>(url,{
        headers: this.getHeaders()
      });
    }
  
    deleteTheatre(theatreId: string): Observable<DataTransferObject> {
      const url = `${this.baseUrl}/DeleteTheatre/${theatreId}`;
      return this.http.delete<DataTransferObject>(url,{
        headers: this.getHeaders()
      });
    }
  
    deleteTheatreMovie(theatreMovieId: string): Observable<DataTransferObject> {
      const url = `${this.baseUrl}/DeleteTheatreMovie/${theatreMovieId}`;
      return this.http.delete<DataTransferObject>(url,{
        headers: this.getHeaders()
      });
    }
    insertMovie(movie: UMovie): Observable<DataTransferObject> {
      const url = `${this.baseUrl}/InsertMovie`;
      return this.http.post<DataTransferObject>(url, movie,{
        headers: this.getHeaders()
      });
    }
  
    insertTheatre(theatre: UTheatre): Observable<DataTransferObject> {
      const url = `${this.baseUrl}/InsertTheatre`;
      return this.http.post<DataTransferObject>(url, theatre,{
        headers: this.getHeaders()
      });
    }
  
    insertTheatreMovie(theatreMovie: TheatreMovieWithName): Observable<DataTransferObject> {
      const url = `${this.baseUrl}/InsertTheatreMovie`;
      return this.http.post<DataTransferObject>(url, theatreMovie, {
        headers: this.getHeaders()
      });
    }
    blockUser(userId: string): Observable<DataTransferObject> {
      const url = `${this.baseUrl}/BlockUser/${userId}`;
      return this.http.post<DataTransferObject>(url,null,{
        headers: this.getHeaders()
      });
    }
  
    unblockUser(userId: string): Observable<DataTransferObject> {
      const url = `${this.baseUrl}/UnblockUser/${userId}`;
      return this.http.post<DataTransferObject>(url,null,{
        headers: this.getHeaders()
      });
    }
  
    deleteUser(userId: string): Observable<DataTransferObject> {
      const url = `${this.baseUrl}/DeleteUser/${userId}`;
      return this.http.delete<DataTransferObject>(url, {
        headers: this.getHeaders()
      });
    }
}