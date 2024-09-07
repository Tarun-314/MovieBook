import { Component } from '@angular/core';
import { Movie } from '../models/data-model';
import { DataService } from '../services/data-services';

@Component({
  selector: 'app-movies',
  templateUrl: './movies.component.html',
  styleUrl: './movies.component.css'
})
export class MoviesComponent {
  movies:Movie[] = [];
  searchMov='';

  constructor(private dataService:DataService)
  {}

  async ngOnInit()
  {
    await this.dataService.fetchAndAssignMovies();
    this.dataService.movies$.subscribe(flag => {
      this.movies = this.dataService.getMovies();
    });
  }

  filterMovies(): Movie[] {
    return this.movies.filter(mov =>
      mov.Title.toLowerCase().startsWith(this.searchMov.toLowerCase())
    );
  }
}
