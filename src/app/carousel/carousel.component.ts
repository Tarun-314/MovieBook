import { AfterViewInit, Component } from '@angular/core';
declare var $: any;

@Component({
  selector: 'app-carousel',
  templateUrl: './carousel.component.html',
  standalone: false,
  styleUrls: ['./carousel.component.css']
})
export class CarouselComponent implements AfterViewInit {
  ngAfterViewInit(): void {
    $('#carouselExampleIndicators').carousel({
      interval: 3000,
      pause: false
    });
  }
}
