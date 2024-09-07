import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-alert',
  templateUrl: './alert.component.html',
  styleUrl: './alert.component.css'
})
export class AlertComponent {
  @Input() message='';
  @Output() mymessage = new EventEmitter<void>(); 

  onClick()
  {
    this.mymessage.emit();
  }
}
