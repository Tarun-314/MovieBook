import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { DataService } from '../services/data-services';
import { Movie, LoggedInUser } from '../models/data-model';
import { Router, NavigationEnd } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from '../services/auth-services';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy {
  Cities: string[] = [];
  selectedCity: string = '';

  user:LoggedInUser;
  citySubscription: Subscription;
  searchedMovies: Movie[] = [];
  searchMovie: string = '';
  isDropdownOpen: boolean = false;
  noMoviesFound: boolean = false;

  constructor(private dataService: DataService, private router: Router, private authService:AuthService) {
    this.Cities = dataService.getCities();
    this.selectedCity = this.Cities[0];
    try {
      this.user = this.dataService.getUserDetails();
    } catch (e) {
      this.router.navigate(['/error']);
    }

    // Close dropdown and clear search on route change
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.isDropdownOpen = false;
        this.searchMovie = '';
        this.searchedMovies = [];
        this.noMoviesFound = false;
      }
    });
  }
  isAuthenticated:boolean =  false;
  mySub:Subscription;

  ngOnInit() {
    this.citySubscription = this.dataService.selectedCity$.subscribe(city => {
      this.selectedCity = city;
    });

    this.mySub = this.authService.userSub.subscribe
    (user => {
        this.isAuthenticated=!!user;
        if(!!user)
        {
            this.user=user; 
        }
      });
  }

  onSearch(): void {
    if (this.searchMovie.trim() === '') {
      this.searchedMovies = this.dataService.getDefaultMovies();
      this.noMoviesFound = false;
    } else {
      this.searchedMovies = this.dataService.getMoviesByName(this.searchMovie);
      this.noMoviesFound = this.searchedMovies.length === 0;
    }
    this.isDropdownOpen = this.searchedMovies.length > 0 || this.noMoviesFound;
    console.log('Dropdown open:', this.isDropdownOpen);
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    const target = event.target as HTMLElement;
    if (!target.closest('.flex-fill')) {
      this.isDropdownOpen = false;
    }
  }

  onInputClick(event: MouseEvent): void {
    event.stopPropagation();
  }

  closeDropdown(): void {
    this.isDropdownOpen = false;
    this.searchMovie = '';
  }

  onMovieSelect(movie: any): void {
    console.log('Selected movie:', movie);
    this.closeDropdown();
  }

  selectCity(city: string): void {
    this.selectedCity = city;
    this.dataService.setCity(this.selectedCity);

    const currentRoute = this.router.url;
    if (currentRoute.includes('/mul-details')) {
      this.router.navigate(['/home']);
    }
  }

  ngOnDestroy(): void {
    this.mySub.unsubscribe();
  }

  onLogout()
  {
    this.authService.logout();
    this.isAuthenticated=false;
  }
}
