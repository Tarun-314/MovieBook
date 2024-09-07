import { Component, OnDestroy, OnInit } from '@angular/core';
import { DataService } from '../services/data-services';
import { Multiplex } from '../models/data-model';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-multiplex',
  templateUrl: './multiplex.component.html',
  styleUrl: './multiplex.component.css'
})
export class MultiplexComponent implements OnInit, OnDestroy{

  multiplexes:Multiplex[] = [];
  searchMul='';
  private citySubscription: Subscription;

  constructor(private dataService:DataService)
  {}

  async ngOnInit() {
    this.citySubscription = this.dataService.selectedCity$.subscribe(async city => {
        await this.dataService.fetchAndAssignTheaters();
        this.dataService.multiplexes$.subscribe(flag => {
            this.multiplexes = this.dataService.getMultiplexByCity(city);
        });
    });
}

  getStars(rating: number): string[] {
    const fullStars = Math.floor(rating);
    const halfStar = rating % 1 >= 0.5 ? 1 : 0;
    const emptyStars = 5 - fullStars - halfStar;

    return [
      ...Array(fullStars).fill('fa-star'),
      ...Array(halfStar).fill('fa-star-half-o'),
      ...Array(emptyStars).fill('fa-star-o')
    ];
  }

  filterMultiplexes(): Multiplex[] {
    return this.multiplexes.filter(mul =>
      mul.Name.toLowerCase().startsWith(this.searchMul.toLowerCase())
    );
  }

  ngOnDestroy(): void {
    if (this.citySubscription) {
      this.citySubscription.unsubscribe();
    }
  }
}
