import { Component } from '@angular/core';
declare var $: any;

@Component({
  selector: 'app-carousel',
  templateUrl: './carousel.component.html',
  styleUrl: './carousel.component.css'
})
export class CarouselComponent {
  
  ngAfterViewInit(): void {
    $('#carouselExampleIndicators').carousel({
      interval: 3000
    });
  }
}
