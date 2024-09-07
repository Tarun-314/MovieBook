import { Component } from '@angular/core';
import { AuthService } from '../services/auth-services';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrl: './forgot-password.component.css'
})
export class ForgotPasswordComponent {
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

    authObs = this.authService.forgot(
        form.value.email,
        form.value.security_question,
        form.value.security_answer
      );
    

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
