export class ITheatre {
    name: string = "";
    area: string = "";
    location: string = "";
    ratings: number = 0;
    screens?: number;
    totalSeats: number = 0;
    image: string = "";
}

export class UTheatre {
    theatreId: string = "";
    name: string = "";
    area: string = "";
    location: string = "";
    ratings: number = 0;
    screens?: number;
    totalSeats: number = 80;
    image: string = "";
    updatedAt?: Date;
}
export class IMovie {
    title: string = "";
    genre: string = "";
    duration: number = 0;
    releaseDate: Date = new Date();
    rating?: number;
    likes: number = 0;
    description: string = "";
    casting: string = "";
    trailer: string = "";
    language: string = "";
    image: string = "";
}

export class UMovie {
    movieId: string = "";
    title: string = "";
    genre: string = "";
    duration: number = 0;
    releaseDate: Date = new Date();
    rating?: number;
    likes: number = 0;
    description: string = "";
    casting: string = "";
    trailer: string = "";
    language: string = "";
    image: string = "";
    updatedAt?: Date;
}
export class ITheatreMovie {
    theatreId: string = "";
    movieId: string = "";
    screenNumber: number = 0;
    showDate: Date = new Date();
    showTimes: string = "";
    availableSeats: string = "";
}

export class TheatreMovieWithName {
    theatreMovieId: string = "";
    theatreId: string = "";
    movieId: string = "";
    movieName: string = "";
    theatreName: string = "";
    screenNumber: number = 0;
    showDate: Date = new Date();
    showTimes: string = "";
    availableSeats: string = "";
    area:string="";
}

export class UserWithBookingCount {
    userId: string = "";
    fullName: string = "";
    email: string = "";
    phoneNumber: string = "";
    role?: string;
    updatedAt?: Date;
    bookingCount: number = 0;
}
export interface BookingDetails {
    userID: string;
    movieName: string;
    theatreName: string;
    bookingDate: Date;
    showDate: Date;
    showTime: string;
    seats: string;
    totalPrice: number;
    transactionID: string;
    paymentMethod: string;
}


