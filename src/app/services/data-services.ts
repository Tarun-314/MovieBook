import { Injectable } from '@angular/core';
import { BehaviorSubject, catchError, map, Observable, of, tap } from 'rxjs';
import { City, Coupon, LinkedMovies, Movie, Multiplex, Bookings, Review, User, Payment, LoggedInUser, IUser, DataTransferObject, BookingHistory, LinkedMovies2 } from "../models/data-model";
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({providedIn:'root'})
export class DataService
{
    private baseUrl="https://localhost:7263"; 
    private getHeaders(): HttpHeaders {
        return new HttpHeaders({
          'Authorization': `Bearer ${this.user.token}`,
          'Content-Type': 'application/json'
        });
      }

    private selectedCitySubject: BehaviorSubject<string> = new BehaviorSubject<string>('');
    selectedCity$: Observable<string> = this.selectedCitySubject.asObservable();
  
    cityobj: City = new City(["Hyderabad", "Chennai", "Mumbai", "Delhi", "Kolkata"]);
    cities: string[] = this.cityobj.cities;
  
    constructor(private http:HttpClient) {
      const savedCity = localStorage.getItem('selectedCity');
      if (savedCity) {
        this.selectedCitySubject.next(savedCity);
      } else {
        this.selectedCitySubject.next(this.getCities()[0]);
      }
      this.selectedCity$.subscribe(city => {
        localStorage.setItem('selectedCity', city);
      });
    }
  
    getCities(): string[] {
      return this.cities;
    }
  
    setCity(city: string): void {
      this.selectedCitySubject.next(city);
    }

    getCity():string
    {
        return this.selectedCitySubject.getValue();
    }

    private multiplexesSubject = new BehaviorSubject<string>('');
    multiplexes$ = this.multiplexesSubject.asObservable();

    private multiplexes: Multiplex[] = [];

    // Function to get all theaters
    public getAllTheatersAPI(): Observable<Multiplex[]> {
        return this.http.get<Multiplex[]>(`${this.baseUrl}/AllTheaters`, {
        headers: this.getHeaders()
        });
    }

    // Function to fetch and assign data to multiplexes array
    public fetchAndAssignTheaters(): Promise<void> {
        return new Promise((resolve, reject) => {
            this.getAllTheatersAPI().subscribe(
                (data: any[]) => {
                    this.multiplexes = data.map(item => new Multiplex(
                        item.theatreId,
                        item.name,
                        item.area,
                        item.location,
                        item.ratings,
                        item.screens,
                        item.totalSeats,
                        item.image,
                        new Date(item.updatedAt)
                    ));
                    this.multiplexesSubject.next("multiplexes");
                    resolve();
                },
                (error) => {
                    console.error('Error fetching theaters:', error);
                    reject(error);
                }
            );
        });
    }


    // Function to get multiplexes by city
    public getMultiplexByCity(city: string): Multiplex[] {
        return this.multiplexes.filter(multiplex => multiplex.Area === city);
    }

    getMultiplexes():Multiplex[]
    {
        return this.multiplexes;
    }

    getMultiplexById(id:string):Multiplex
    {
        return this.multiplexes.find(multiplex => multiplex.TheatreID === id);
    }

    private movies: Movie[] = [];

    private movieSubject = new BehaviorSubject<string>('');
    movies$ = this.movieSubject.asObservable();

    // Function to get all movies
    public getAllMoviesAPI(): Observable<Movie[]> {
        return this.http.get<Movie[]>(`${this.baseUrl}/AllMovies`, {
        headers: this.getHeaders()
        });
    }

    public fetchAndAssignMovies(): Promise<void> {
        return new Promise((resolve, reject) => {
            this.getAllMoviesAPI().subscribe(
                (data: any[]) => {
                    this.movies = data.map(item => new Movie(
                        item.movieId,
                        item.title,
                        item.genre,
                        item.duration,
                        new Date(item.releaseDate),
                        item.rating ?? 0, // Default to 0 if Rating is null
                        item.likes,
                        item.description,
                        item.casting,
                        item.trailer,
                        item.language,
                        item.image,
                        item.updatedAt ? new Date(item.updatedAt) : new Date() // Default to current date if UpdatedAt is null
                    ));
                    this.movieSubject.next("movies");
                    resolve();
                },
                (error) => {
                    console.error('Error fetching movies:', error);
                    reject(error);
                }
            );
        });
    }
    
    getMovies(): Movie[] {
        return this.movies;
    }

    getMovieById(id:string):Movie
    {
        return this.movies.find(movie => movie.MovieID === id);
    }

    private reviewsSubject = new BehaviorSubject<string>('');
    reviews$ = this.reviewsSubject.asObservable();

    private reviews: Review[] = [];

    // Function to get all movies
    public getAllReviewsAPI(movieID:string): Observable<Review[]> {
        return this.http.get<Review[]>(`${this.baseUrl}/Reviews/${movieID}`, {
        headers: this.getHeaders()
        });
    }

    getDefaultMovies(): Movie[] {
        const sortedMovies = this.movies.sort((a, b) => {
          const dateA = new Date(a.ReleaseDate);
          const dateB = new Date(b.ReleaseDate);
          return dateB.getTime() - dateA.getTime(); // Sort in descending order
        });
      
        return sortedMovies.slice(0, 4); // Return only the top 4 movies
    }  

    getMoviesByName(search: string): Movie[] {
        return this.movies.filter(movie => movie.Title.toLowerCase().startsWith(search.toLowerCase()));
    }

    public fetchAndAssignReviews(movieID: string): Promise<void> {
        return new Promise((resolve, reject) => {
            this.getAllReviewsAPI(movieID).subscribe(
                (data: any[]) => {
                    this.reviews = data.map(item => new Review(
                        item.reviewID,
                        item.userID,
                        item.userName,
                        item.movieID,
                        item.rating ?? 0, // Default to 0 if Rating is null
                        item.comment ?? '', // Default to empty string if Comment is null
                        item.reviewDate ? new Date(item.reviewDate) : new Date() // Default to current date if ReviewDate is null
                    ));
                    this.reviewsSubject.next("reviews");
                    resolve();
                },
                (error) => {
                    console.error('Error fetching reviews:', error);
                    reject(error);
                }
            );
        });
    }    
  
    getReviews(movieID: string): Review[] {
        return this.reviews.filter(review => review.MovieID === movieID);
    }

    pushReview(review: Review)
    {
      this.reviews.push(review);
    }
   
    postReview(review: Review): Observable<any> {
      const url = `${this.baseUrl}/AddReview`;
      return this.http.post<any>(url, review, {
        headers: this.getHeaders()
      });
    }

    canAddReview(movieID: string): Observable<boolean> {
      const url = `${this.baseUrl}/CanAddReview?movieId=${movieID}`;
      return this.http.get<boolean>(url, {
        headers: this.getHeaders()
      });
    }


    private user:LoggedInUser;
    
    setUserProfile(user:IUser):Observable<DataTransferObject>{
        return this.http.put<DataTransferObject>(`${this.baseUrl}/UpdateUser`,user,{
            headers:this.getHeaders()
        });
    }

    getUserProfile():Observable<IUser>
    {
        return this.http.get<IUser>(`${this.baseUrl}/GetUserById`,{
            headers:this.getHeaders()
        });
    }

    getUserDetails():LoggedInUser
    {
        return this.user;
    }

    setUser(user:LoggedInUser)
    {
        this.user=user;
    }

      
    getUserPurchaseHistory():Observable<BookingHistory[]>
    {
        return this.http.get<BookingHistory[]>(`${this.baseUrl}/GetBookingsByUserId`,{
            headers:this.getHeaders()
        });
    }
      

    // Function to get all movies
    public getLinkedMoviesByIDDateAPI(theatreId:string, selectedDate:string): Observable<LinkedMovies[]> {
        return this.http.get<LinkedMovies[]>(`${this.baseUrl}/TheatreMovies/${theatreId}/${selectedDate}`, {
            headers: this.getHeaders()
        });
    }
    
    // getLinkedMovies():LinkedMovies[]
    // {
    //     return this.linkedMovies;
    // }

    // getLinkedMoviesByIDDate(theatreID: string, date: string): LinkedMovies[] {
    //     return this.linkedMovies;
    // }      

    getLinkedMulsByIDDateCityAPI(movieID: string, date:string, city:string):Observable<LinkedMovies2[]>    {
        return this.http.get<LinkedMovies2[]>(`${this.baseUrl}/MoviesTheatre/${movieID}/${date}/${city}`, {
            headers: this.getHeaders()
        });
    }

    // getSeatString(multiplexID: string, movieName: string, selectedDate: string, selectedTime: string): string {

    //     for (const movie of this.linkedMovies) {
    //         if (
    //             movie.TheatreID === multiplexID &&
    //             movie.MovieName === movieName &&
    //             movie.ShowDate.toISOString().split('T')[0] === selectedDate 
    //         ) {
    //             const showTimes = JSON.parse(movie.ShowTimes);
    //             if (showTimes[selectedTime]) {
    //                 return showTimes[selectedTime];
    //             }
    //         }
    //     }
        
    //     return "00000000000000000000000000000000000000000000000000000000000000000000000000000000";
    // }

    // setSeatString(multiplexID: string, movieName: string, selectedDate: string, selectedTime: string, newSeatString: string): boolean {
    //     for (const movie of this.linkedMovies) {
    //       if (
    //         movie.TheatreID === multiplexID &&
    //         movie.MovieName === movieName &&
    //         movie.ShowDate.toISOString().split('T')[0] === selectedDate
    //       ) {
    //         const showTimes = JSON.parse(movie.ShowTimes);
    //         if (showTimes[selectedTime]) {
    //           showTimes[selectedTime] = newSeatString;
    //           movie.ShowTimes = JSON.stringify(showTimes);
    //           return true;
    //         }
    //       }
    //       else
    //         return false;
    //     }
    //   }

    getCoupon(couponCode: string): Observable<number> {
        return this.http.get<number>(`${this.baseUrl}/Coupon/${couponCode}`,{headers:this.getHeaders()});
    }

    confirmBooking(bookingData:any):Observable<DataTransferObject>
    {
        console.log(bookingData);
        return this.http.post<DataTransferObject>(`${this.baseUrl}/AddBooking/`,bookingData,{headers:this.getHeaders()});
    }
    
}