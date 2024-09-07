import { Component, OnInit } from '@angular/core';
import { DataService } from '../services/data-services';
import { BookingHistory, DataTransferObject, IUser, LoggedInUser } from '../models/data-model';
import * as CryptoJS from 'crypto-js';
import { AuthService } from '../services/auth-services';
declare var $: any;

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent implements OnInit{


  constructor(private dataService:DataService, private authService:AuthService){}
  user:IUser;
  user_purchase_history:BookingHistory[];
  bookingdata:boolean=false;

  ngOnInit()
  {
    this.GetUser();
    this.GetBookings();
  }
  ngAfterViewChecked(): void {
    if (this.bookingdata) {
      $(document).ready(function() {
        $('#Table5').DataTable({
          paging: true,
          searching: true,
          ordering: true,
          info: true,
          lengthChange: true
        });
      });
      this.bookingdata = false;
    }
  }

  GetBookings(){
    this.dataService.getUserPurchaseHistory().subscribe({
      next:(data:BookingHistory[])=>{
        this.user_purchase_history=data;
        console.log(data);
        this.bookingdata=true;
      },error:(err)=>{
        console.log(err);
      }
    })
  }

  UpdateUser() {
    const tempPass=this.user.passwordHash;
    this.user.passwordHash=CryptoJS.MD5(this.user.passwordHash).toString();
    this.dataService.setUserProfile(this.user).subscribe({
      next:(res:DataTransferObject)=>{
        console.log(res.message);
        this.user.passwordHash=tempPass;

        let userData = JSON.parse(localStorage.getItem('userData'));
        userData.name = this.user.fullName;
        userData.email = this.user.email;
        localStorage.setItem('userData', JSON.stringify(userData));
        console.log('User data stored in localStorage:', localStorage.getItem('userData'));

        this.authService.userSub.next(userData);

      },error:(msg)=>{
        console.log(msg);
        this.user_purchase_history=[];
      }
    })
  }
  
  GetUser(){
    this.dataService.getUserProfile().subscribe({
      next:(user:IUser)=>{
        console.log(user.passwordHash);
        this.user=user;
        console.log(this.user);
        this.user.passwordHash="";
      },
      error:(msg)=>{
        console.log(msg);
      }
    });
  }
}
