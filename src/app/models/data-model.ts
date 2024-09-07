import { model } from "@angular/core";

export class City{
    cities: string[];  
    constructor(array:string[]){
        this.cities=array;
    }
}

export class Multiplex {
    TheatreID: string;
    Name: string;
    Area: string;
    Location: string;
    Ratings: number;
    Screens: number;
    TotalSeats: number;
    Image: string;
    UpdatedAt: Date;
  
    constructor(
      TheatreID: string,
      Name: string,
      Area: string,
      Location: string,
      Ratings: number,
      Screens: number,
      TotalSeats: number,
      Image: string,
      UpdatedAt: Date = new Date()
    ) {
      this.TheatreID = TheatreID;
      this.Name = Name;
      this.Area = Area;
      this.Location = Location;
      this.Ratings = Ratings;
      this.Screens = Screens;
      this.TotalSeats = TotalSeats;
      this.Image = Image;
      this.UpdatedAt = UpdatedAt;
    }
  }
  

export class Movie {
  MovieID: string;
  Title: string;
  Genre: string;
  Duration: number;
  ReleaseDate: Date;
  Rating: number;
  Likes: number;
  Description: string;
  Casting: string;
  Trailer: string;
  Language: string;
  Image: string;
  UpdatedAt: Date;

  constructor(
    MovieID: string,
    Title: string,
    Genre: string,
    Duration: number,
    ReleaseDate: Date,
    Rating: number,
    Likes: number,
    Description: string,
    Casting: string,
    Trailer: string,
    Language: string,
    Image: string,
    UpdatedAt: Date = new Date()
  ) {
    this.MovieID = MovieID;
    this.Title = Title;
    this.Genre = Genre;
    this.Duration = Duration;
    this.ReleaseDate = ReleaseDate;
    this.Rating = Rating;
    this.Likes = Likes;
    this.Description = Description;
    this.Casting = Casting;
    this.Trailer = Trailer;
    this.Language = Language;
    this.Image = Image;
    this.UpdatedAt = UpdatedAt;
  }
}


export class Review {
  ReviewID?: string;
  UserID?: string;
  UserName: string;
  MovieID: string;
  Rating: number;
  Comment: string;
  ReviewDate: Date;

  constructor(
    ReviewID: string,
    UserID: string,
    UserName: string,
    MovieID: string,
    Rating: number,
    Comment: string,
    ReviewDate: Date
  ) {
    this.ReviewID = ReviewID;
    this.UserID = UserID;
    this.UserName = UserName;
    this.MovieID = MovieID;
    this.Rating = Rating;
    this.Comment = Comment;
    this.ReviewDate = ReviewDate;
  }
}
export class IUser {
  userId!: string;
  fullName!: string;
  passwordHash!: string;
  email!: string;
  phoneNumber!: string;
  securityQuestion?: string;
  securityAnswer?: string;
}
export class DataTransferObject {
  data!: string;
  message!: string;
  isSuccess!: boolean;
  value!: number;
}
export class BookingHistory {
  userID!: string;
  movieName!: string;
  theatreName!: string;
  bookingDate?: Date;   
  showDate!: Date;       
  showTime!: string;
  seats!: string;
  totalPrice!: number;   
  transactionID!: string;
  paymentMethod!: string;
}

export class User {
  UserID: string;
  FullName: string;
  PasswordHash: string;
  Email: string;
  PhoneNumber: string;
  Bookings: string;
  SecurityQuestion?: string;
  SecurityAnswer?: string;
  Role: string;
  UpdatedAt: Date;

  constructor(
    UserID: string,
    FullName: string,
    PasswordHash: string,
    Email: string,
    PhoneNumber: string,
    Bookings: string,
    SecurityQuestion?: string,
    SecurityAnswer?: string,
    Role: string = 'User',
    UpdatedAt: Date = new Date()
  ) {
    this.UserID = UserID;
    this.FullName = FullName;
    this.PasswordHash = PasswordHash;
    this.Email = Email;
    this.PhoneNumber = PhoneNumber;
    this.Bookings = Bookings;
    this.SecurityQuestion = SecurityQuestion;
    this.SecurityAnswer = SecurityAnswer;
    this.Role = Role;
    this.UpdatedAt = UpdatedAt;
  }
}

export class Bookings {
  BookingID: string;
  UserID: string;
  MovieID: string;
  MovieName: string;
  TheatreID: string;
  TheatreName: string;
  BookingDate: Date;
  ShowDate: Date;
  ShowTime: string;
  ScreenNumber: number;
  NumberOfSeats: number;
  Seats: string;
  TotalPrice: number;
  TransactionID: string;
  Status: string;
  PaymentMethod: string;

  constructor(
    BookingID: string,
    UserID: string,
    MovieID: string,
    MovieName: string,
    TheatreID: string,
    TheatreName: string,
    BookingDate: Date,
    ShowDate: Date,
    ShowTime: string,
    ScreenNumber: number,
    NumberOfSeats: number,
    Seats: string,
    TotalPrice: number,
    TransactionID: string,
    Status: string,
    PaymentMethod: string
  ) {
    this.BookingID = BookingID;
    this.UserID = UserID;
    this.MovieID = MovieID;
    this.MovieName = MovieName;
    this.TheatreID = TheatreID;
    this.TheatreName = TheatreName;
    this.BookingDate = BookingDate;
    this.ShowDate = ShowDate;
    this.ShowTime = ShowTime;
    this.ScreenNumber = ScreenNumber;
    this.NumberOfSeats = NumberOfSeats;
    this.Seats = Seats;
    this.TotalPrice = TotalPrice;
    this.TransactionID = TransactionID;
    this.Status = Status;
    this.PaymentMethod = PaymentMethod;
  }
}

export class LinkedMovies {
  theatreId: string;
  movieId: string;
  title: string;
  screenNumber: number;
  language: string;
  releaseDate: Date;
  rating: number;
  likes: number;
  showTimes: string;
  image: string;

  constructor(
    theatreId: string,
    movieId: string,
    title: string,
    screenNumber: number,
    language: string,
    releaseDate: Date,
    rating: number,
    likes: number,
    showTimes: string,
    image: string
  ) {
    this.theatreId = theatreId;
    this.movieId = movieId;
    this.title = title;
    this.screenNumber = screenNumber;
    this.language = language;
    this.releaseDate = releaseDate;
    this.rating = rating;
    this.likes = likes;
    this.showTimes = showTimes;
    this.image = image;
  }
}

export class LinkedMovies2 {
  theatreId: string;
  movieId: string;
  name: string;
  area: string;
  location: string;
  screenNumber: number;
  rating: number;
  showTimes: string;
  image: string;

  constructor(
    theatreId: string,
    movieId: string,
    name: string,
    area: string,
    location: string,
    screenNumber: number,
    rating: number,
    showTimes: string,
    image: string
  ) {
    this.theatreId = theatreId;
    this.movieId = movieId;
    this.name = name;
    this.area = area;
    this.location = location;
    this.screenNumber = screenNumber;
    this.rating = rating;
    this.showTimes = showTimes;
    this.image = image;
  }
}


export class Coupon {
  constructor(
    public CouponID: string,
    public CouponCode: string,
    public DiscountAmount: number
  ) {}
}

export class Payment {
  PaymentID: string;
  BookingID: string;
  Amount: number;
  PaymentDate: Date;
  PaymentMethod: string;
  TransactionID: string;

  constructor(
    PaymentID: string,
    BookingID: string,
    Amount: number,
    PaymentDate: Date,
    PaymentMethod: string,
    TransactionID: string
  ) {
    this.PaymentID = PaymentID;
    this.BookingID = BookingID;
    this.Amount = Amount;
    this.PaymentDate = PaymentDate;
    this.PaymentMethod = PaymentMethod;
    this.TransactionID = TransactionID;
  }
}


export class LoggedInUser {
  constructor(
    public email: string,
    public role: string,
    public name: string,
    public token: string,
    public tokenExpirationDate: Date,
    public SecurityQuestion?:string,
    public SecurityAnswer?:string,
    public passwordHash?: string,
    public phoneNumber?: string,
  ) {}

  get validToken() {
    if (!this.tokenExpirationDate || new Date() > this.tokenExpirationDate) {
      return false;
    }
    return true;
  }
}

