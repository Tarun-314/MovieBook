import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { BehaviorSubject, catchError, tap, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { LoggedInUser } from '../models/data-model';
 
export interface AuthResponseData {
  email:string;
  role:string;
  name:string;
  token:string;
  isSuccess: boolean;
  message:string;
}
 
@Injectable({ providedIn: 'root' })
export class AuthService {
  constructor(private http: HttpClient, private router: Router) {}
  tokenExpiryTimer: any;
 
  userSub = new BehaviorSubject<LoggedInUser>(null);
 
  signup(fullName: string, passwordHash: string, email: string, phoneNumber: string, securityQuestion: string, securityAnswer: string) {
    return this.http
      .post<AuthResponseData>(
        'https://localhost:7263/Register',
        { 
          "userId":"string",
          "fullName":fullName,
          "passwordHash":passwordHash,
          "email":email,
          "phoneNumber":phoneNumber,
          "securityQuestion":securityQuestion,
           "securityAnswer":securityAnswer 
        }
      ).pipe(
        catchError(this.errorHandler),
        tap(respData => {
          this.authHandler(email, respData.role, respData.name, respData.token, 3600); // 60 mins
        })
      );
  }
 
  login(useremail: string, password: string) {
    return this.http
      .post<AuthResponseData>(
        'https://localhost:7263/login',
        { useremail, password, token: 'string', sercurityQuestion: 'string' }
      ).pipe(
        catchError(this.errorHandler),
        tap(respData => {
          this.authHandler(useremail, respData.role, respData.name, respData.token, 3600); // 60 mins
        })
      );
  }
 
  forgot(useremail: string, security_question: string, security_answer: string) {
    return this.http
      .post<AuthResponseData>(
        'https://localhost:7263/forgotpassword',
        {
          "useremail": useremail,
          "password": security_answer,
          "token": "string",
          "sercurityQuestion": security_question
        }
      ).pipe(
        catchError(this.errorHandler),
        tap(respData => {
          this.authHandler(useremail, respData.role, respData.name, respData.token, 3600); // 60 mins
        })
      );
  }
 
  logout() {
    console.log('Logging out');
    this.userSub.next(null);
    localStorage.removeItem('userData');
 
    if (this.tokenExpiryTimer) {
      clearTimeout(this.tokenExpiryTimer);
    }
 
    this.tokenExpiryTimer = null;
    this.router.navigate(['/auth']);
  }
 
  autoLogin(){
    const userData = JSON.parse(localStorage.getItem('userData'));
    if (!userData) return;
    const loadedUser = new LoggedInUser(userData.email, userData.role, userData.name, userData.token, new Date(userData.tokenExpirationDate));
 
    if (loadedUser.validToken) {
      const expireIn = new Date(userData.tokenExpirationDate).getTime() - new Date().getTime();
      console.log('Token expires in:', expireIn, 'milliseconds');
      this.autoLogout(expireIn);
      this.userSub.next(loadedUser);
    }
  }
 
  autoLogout(expiryTimer: number) {
    if (this.tokenExpiryTimer) {
      clearTimeout(this.tokenExpiryTimer);
    }
    console.log('Setting autoLogout timer for:', expiryTimer, 'milliseconds');
    this.tokenExpiryTimer = setTimeout(() => {
      this.logout();
    }, expiryTimer);
  }
 
  private authHandler(email: string, role:string, name: string, token: string, expireIn: number) {
    const expiryDate = new Date(new Date().getTime() + expireIn * 1000);
    const user = new LoggedInUser(email, role, name, token, expiryDate);
    console.log('Storing user data:', user);
    this.userSub.next(user);
    this.autoLogout(expireIn * 1000);
 
    try {
      localStorage.setItem('userData', JSON.stringify(user));
      console.log('User data stored in localStorage:', localStorage.getItem('userData'));
    } catch (error) {
      console.error('Error storing user data in localStorage:', error);
    }
  }
 
  private errorHandler(responseError: HttpErrorResponse) {
    let errorMsg = "An unexpected error occurred.";
    console.log(responseError);
    if (responseError.error) {
      switch (responseError.error.message) {
        case 'EMAIL_EXISTS':
          errorMsg = "Entered email already exists.";
          break;
        case 'INVALID_CREDENTIALS':
          errorMsg = "Invalid credentials. Please try again.";
          break;
        case 'BLOCKED_USER':
          errorMsg = "User Blocked. Please contact administrator.";
          break;
        case 'REG_FAILED':
          errorMsg = "Bad Request. Please try again.";
          break;
        case 'LOGIN_EXPIRED':
          errorMsg = "Login Expired. Please login again.";
          break;
        default:
          errorMsg = "Unexpected error. Please try again.";
          break;
      }
    }
    return throwError(errorMsg);
  }
}