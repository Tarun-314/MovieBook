import { Component } from '@angular/core';

@Component({
  selector: 'app-loading-spinner',
  template: '<div class="lds-dual-ring"></div>',
  standalone: false,
  styleUrl: './loading-spinner.component.css'
})
export class LoadingSpinnerComponent {

}
