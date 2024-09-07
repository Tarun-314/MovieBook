import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthService } from '../services/auth-services';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.css'
})
export class FooterComponent implements OnInit, OnDestroy{
  isAuthenticated:boolean =  false;
  mySub:Subscription;

  constructor(private authService:AuthService){}

  ngOnInit()
  {
    this.mySub = this.authService.userSub.subscribe
    (user => {
        this.isAuthenticated=!!user;
      });
  }

  ngOnDestroy(): void {
    this.mySub.unsubscribe();
  }
  
}
