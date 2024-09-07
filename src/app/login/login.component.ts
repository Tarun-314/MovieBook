import { Component, OnDestroy, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService } from '../services/auth-services';
import { Router } from '@angular/router';
import * as CryptoJS from 'crypto-js';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit, OnDestroy {
  isForgotPassword: boolean = false;
  isRegistering: boolean = false;
  securityQuestion: string = '';
  securityAnswer: string = '';
  
  isLoading: boolean = false;
  error: string = null;
  mySub:Subscription;

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.mySub = this.authService.userSub.subscribe
    (user => {
      if(user)
        this.router.navigate(['/home']);
      });
  }

  ngOnDestroy(): void {
    this.mySub.unsubscribe();  
  }

  flipCard(direction: string) {
    const card = document.getElementById("card");
    if (card) {
      card.style.transform = direction === 'register' ? "rotateY(-180deg)" : "rotateY(0deg)";
    }
  }

  onSubmit(form: NgForm) {
    if (!form.valid) {
      Object.keys(form.controls).forEach(field => {
        const control = form.control.get(field);
        control.markAsTouched({ onlySelf: true });
      });
      return;
    }

    this.isLoading = true;
    let authObs;

    const passwordHash = CryptoJS.MD5(form.value.password).toString();

    if (this.isRegistering) {
      authObs = this.authService.signup(
        form.value.name,
        passwordHash,
        form.value.email,
        form.value.mobile,
        form.value.security_question,
        form.value.security_answer
      );
    } else {
      authObs = this.authService.login(form.value.email, passwordHash);
    }

    authObs.subscribe(
      responseData => {
        console.log('Form Submitted', responseData);
        this.isLoading = false;
        this.error = null;
        if (responseData.isSuccess) {
          this.router.navigate(['/home']).then(success => {
            if (success) {
              console.log('Navigation successful');
            } else {
              console.log('Navigation failed');
            }
          });
        }
      },
      errorMsg => {
        console.log(errorMsg);
        this.isLoading = false;
        this.error = errorMsg;
      }
    );

    form.reset();
  }

  onCloseAlert() {
    this.error = null;
  }
}
