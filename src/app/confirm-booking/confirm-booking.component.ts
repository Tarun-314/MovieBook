import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import html2canvas from 'html2canvas';
import QRCode from 'qrcode';
import { DataService } from '../services/data-services';
import { DataTransferObject } from '../models/data-model';
import { throwError } from 'rxjs';

@Component({
  selector: 'app-confirm-booking',
  templateUrl: './confirm-booking.component.html',
  styleUrls: ['./confirm-booking.component.css']
})
export class ConfirmBookingComponent implements OnInit, OnDestroy {
  bookingId: string = '';
  qrCodeUrl: string = '';
  bookingData:any;
  isError:boolean = false;

  constructor(private router:Router, private dataService:DataService){}
  ngOnInit() {
    this.retrieveStateData();
  }

  ngOnDestroy(): void {
    if(!this.isError)
      this.router.navigate(["/home"]);
  }

  retrieveStateData() {
    this.bookingData = history.state;
    console.log('Retrieved State Data:', this.bookingData);
  
    if (!this.bookingData.theatreID || 
        !this.bookingData.theatreName || 
        !this.bookingData.movieName || 
        !this.bookingData.movieId ||
        !this.bookingData.moviePoster || 
        !this.bookingData.language || 
        !this.bookingData.selectedDate || 
        !this.bookingData.screenNumber ||
        !this.bookingData.selectedTime || 
        !this.bookingData.seats || 
        !this.bookingData.amount || 
        !this.bookingData.seatString ||
        !this.bookingData.paymentMethod ||
        !this.bookingData.transactionId
      ) {
      this.router.navigate(['/error']);
    } else {
      this.dataService.confirmBooking(
        {
          "userId": "user",
          "theatreId": this.bookingData.theatreID,
          "movieId": this.bookingData.movieId,
          "selectedDate": this.bookingData.selectedDate,
          "selectedTime": this.bookingData.selectedTime,
          "seats": this.bookingData.seats ,
          "screenNumber": +this.bookingData.screenNumber,
          "amount": +this.bookingData.amount,
          "seatString": this.bookingData.seatString ,
          "paymentMethod": this.bookingData.paymentMethod ,
          "transactionId": this.bookingData.transactionId 
        }).subscribe({
        next:(data:DataTransferObject) => {
            if(data.isSuccess)
            {
              this.bookingId = data.data;
              this.generateQRCode(this.bookingId);
              console.log("all details saved..!");
            }
            else
            {
              this.isError=true;
              console.log("Error");
              this.router.navigate(["/error"]);
            }
        },
        error:(error) =>{
          this.isError=true;
          console.log("Error");
          this.router.navigate(["/error"]);
        }
      });
    }
  }

  generateQRCode(bookingId:string) {
    QRCode.toDataURL(bookingId, { errorCorrectionLevel: 'H' }, (err, url) => {
      if (err) {
        console.error('Error generating QR code:', err);
        return;
      }
      this.qrCodeUrl = url;
    });
  }


  downloadImage() {
    const ticketElement = document.querySelector('.ticket') as HTMLElement;

    html2canvas(ticketElement, {
      scale: 1.2, 
      useCORS: true,
      allowTaint: true
    }).then(canvas => {
      const imgData = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.href = imgData;
      link.download = 'ticket.png';
      link.click();
    }).catch(error => {
      console.error('Error generating image:', error);
    });
  }
}
