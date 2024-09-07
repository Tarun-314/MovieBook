import { Component, Renderer2, OnInit, OnDestroy } from '@angular/core';
import {  Router } from '@angular/router';
import { DataService } from '../services/data-services';
import { NgForm } from '@angular/forms';
import QRCode from 'qrcode';

@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.css']
})
export class PaymentComponent implements OnInit, OnDestroy {
  bookingData: any;
  couponDiscount: number = 0;
  couponApplied: boolean = false;
  discountedAmount: number = 0;
  upiUrl = 'upi://pay?pa=7093794029@ybl&pn=Vamsi&cu=INR&am=0';
  cannotApply:boolean = false;

  constructor(private renderer: Renderer2, private router: Router, private dataService: DataService) {}

  private eventListeners: (() => void)[] = [];

  ngOnInit() {
    this.retrieveStateData();
    this.setupEventListeners();
    this.generateQRCode();
  }

  ngOnDestroy(): void {
    this.eventListeners.forEach(unlisten => unlisten());
  }

  onSubmit(couponForm: NgForm) {
    this.dataService.getCoupon(couponForm.value.code.toUpperCase()).subscribe({
      next:(amt:number)=>{
        this.couponDiscount=amt;
        if(this.bookingData.amount-amt < 0)
            this.cannotApply=true;
        else if (this.couponDiscount > 0) {
          this.couponApplied = true;
          this.discountedAmount = this.bookingData.amount - this.couponDiscount;
          this.upiUrl = 'upi://pay?pa=7093794029@ybl&pn=Vamsi&cu=INR&am='+this.discountedAmount;
          this.generateQRCode();
        } else {
          this.couponApplied = false;
          this.couponDiscount = -1; 
          this.discountedAmount = this.bookingData.amount;
        }
      }
    });
    
  }

  resetCouponState() {
    this.couponDiscount = 0;
    this.couponApplied = false;
    this.cannotApply = false;
    this.discountedAmount = this.bookingData.amount;
  }

  retrieveStateData() {
    this.bookingData = history.state;
  
    if (!this.bookingData.theatreID || 
        !this.bookingData.theatreName || 
        !this.bookingData.theatreArea || 
        !this.bookingData.movieName || 
        !this.bookingData.movieId ||
        !this.bookingData.moviePoster || 
        !this.bookingData.language || 
        !this.bookingData.selectedDate || 
        !this.bookingData.selectedTime || 
        !this.bookingData.seats || 
        !this.bookingData.amount || 
        !this.bookingData.seatString ||
        !this.bookingData.screenNumber
      ) {
      this.router.navigate(['/error']);
    } else {
      this.discountedAmount = this.bookingData.amount; 
      this.upiUrl = 'upi://pay?pa=7093794029@ybl&pn=Vamsi&cu=INR&am='+this.discountedAmount;
      this.generateQRCode();
    }
  }
  
  generateTransactionId(): string {
    const timestamp = Date.now().toString(); 
    const transactionId = 'TX' + timestamp.slice(-8); 
    return transactionId;
  }
  
  selectedMethod: string='';

  onSelect(method: string) {
    this.selectedMethod = method;
  }

  onPay(slectedMethod:string)
  {
    this.bookingData.amount=this.discountedAmount;
    this.bookingData.paymentMethod = slectedMethod;
    this.bookingData.transactionId = this.generateTransactionId();
    this.router.navigate(['/ticket-confirm'], { state: this.bookingData });
  }


  generateQRCode() {
    QRCode.toDataURL(this.upiUrl, { errorCorrectionLevel: 'H' }, (err, url) => {
      if (err) {
        console.error('Error generating QR code:', err);
        return;
      }
      const scanQrElement = document.getElementById('scanQr');
      if (scanQrElement) {
        // Clear any existing children
        scanQrElement.innerHTML = '';

        // Create an image element
        const img = document.createElement('img');
        img.src = url;
        img.alt = 'Scan to Pay';

        // Append the image as the only child
        scanQrElement.appendChild(img);
      }
    });
  }
  

  setupEventListeners() {
    // Toggle the card details display
    const listen1 = this.renderer.listen('document', 'click', (event) => {
      const cardHeader = event.target.closest('.card-header2');
      if (cardHeader) {
        const cardDetails = cardHeader.nextElementSibling as HTMLElement;
        document.querySelectorAll('.card-body2').forEach(body => {
          if (body !== cardDetails) {
            body.classList.remove('show');
            (body as HTMLElement).style.maxHeight = '0';
            (body as HTMLElement).style.opacity = '0';
          }
        });
        if (cardDetails) {
          if (cardDetails.classList.contains('show')) {
            cardDetails.classList.remove('show');
            cardDetails.style.maxHeight = '0';
            cardDetails.style.opacity = '0';
          } else {
            cardDetails.classList.add('show');
            cardDetails.style.maxHeight = `${cardDetails.scrollHeight + 20}px`;
            cardDetails.style.opacity = '1';
          }
        }
      }
    });

    this.eventListeners.push(listen1);

    // Handle payment option selection
    document.querySelectorAll('.payment-option').forEach(button => {
      const listen2 = this.renderer.listen(button, 'click', () => {
        document.querySelectorAll('.payment-option').forEach(btn => btn.classList.remove('selected'));
        button.classList.add('selected');
      });

      this.eventListeners.push(listen2);
    });

    // Handle proceed button click
    const proceedButton = document.getElementById('proceedButton');
    if (proceedButton) {
      const listen3=this.renderer.listen(proceedButton, 'click', () => {
        const selectedOption = document.querySelector('.payment-option.selected');
        if (selectedOption) {
          alert(`Proceeding with ${selectedOption.textContent.trim()}`);
          // Add further payment processing logic here
        } else {
          alert('Please select a payment method');
        }
      });
      this.eventListeners.push(listen3);
    }
  }
}
