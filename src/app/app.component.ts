import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { AuthService } from './services/auth-services';
import { DataService } from './services/data-services';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  mySub:Subscription;
  constructor(private router: Router, private authService:AuthService, private dataService:DataService) {}

  ngOnInit() {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      window.scrollTo(0, 0);
    });

    this.authService.autoLogin();

    this.mySub = this.authService.userSub.subscribe
    (user => {
        if(!!user)
        {
          this.dataService.setUser(user);
        }
      });  
  }
}
