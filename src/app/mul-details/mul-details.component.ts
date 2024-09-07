import { Component, Renderer2, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, NavigationStart, Params, Router } from '@angular/router';
import { LinkedMovies, Multiplex } from '../models/data-model';
import { DataService } from '../services/data-services';
import { Subscription } from 'rxjs';

declare var $: any;

@Component({
  selector: 'app-mul-details',
  templateUrl: './mul-details.component.html',
  styleUrls: ['./mul-details.component.css']
})
export class MulDetailsComponent implements OnInit, AfterViewInit, OnDestroy {

  id:string;
  multiplex:Multiplex;
  isMulPresent:boolean = false;
  linkedMovies:LinkedMovies[] = [];
  isDateSelected:boolean = false;
  searchLM:string='';
  seatString:string = "00000000000000000000000000000000000000000000000000000000000000000000000000000000";
  selectedDate: string | null = null;
  selectedTime: string | null = null;
  movieName: string='';
  moviePoster: string='';
  movieLang: string='';
  selectedSeats: string='';
  totalPrice: string='';
  screenNumber: string='';
  movieID:string='';

  private eventListeners: (() => void)[] = [];
  private navigationSubscription: Subscription;

  constructor(private renderer: Renderer2, private router:Router, private route:ActivatedRoute, private dataService:DataService) {}

  ngOnInit() {
    this.route.params.subscribe(async (params: Params) => {
      this.id = params['id'];
      if (this.id) {
        await this.dataService.fetchAndAssignTheaters();
        this.multiplex = this.dataService.getMultiplexById(this.id);
        if(this.multiplex)
          this.isMulPresent=true;
        else
          this.router.navigate(['/error']);
      } else {
        this.router.navigate(['/error']);
      }
    }); 
    
    this.navigationSubscription = this.router.events.subscribe(event => {
      if (event instanceof NavigationStart) {
        if (event.navigationTrigger === 'popstate' && event.restoredState) {
          this.router.navigate([this.router.url]);
        }
      }
    });
  }

  ngAfterViewInit() {
    this.generateDateButtons();
    this.setupDateAndTimeSelection();
  }

  ngOnDestroy() {
    this.eventListeners.forEach(unlisten => unlisten());
    $('#selectionModal').modal('hide');
    $('.modal-backdrop').remove();
    $('body').removeClass('modal-open');

    if (this.navigationSubscription) {
      this.navigationSubscription.unsubscribe();
    }
  }

  getStars(rating: number): string[] {
    const fullStars = Math.floor(rating);
    const halfStar = rating % 1 >= 0.5 ? 1 : 0;
    const emptyStars = 5 - fullStars - halfStar;

    return [
      ...Array(fullStars).fill('fa-star'),
      ...Array(halfStar).fill('fa-star-half-o'),
      ...Array(emptyStars).fill('fa-star-o')
    ];
  }
  
  formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  generateDateButtons(): void {
    const dateContainer = this.renderer.selectRootElement('#date-container', true);
    const today = new Date();
    
    // Clear existing buttons
    this.renderer.setProperty(dateContainer, 'innerHTML', '');

    for (let i = 0; i < 5; i++) {
        const currentDate = new Date(today);
        currentDate.setDate(today.getDate() + i);
        
        const formattedDate = this.formatDate(currentDate);
        const displayDate = `${currentDate.getDate()} ${currentDate.toLocaleString('default', { month: 'short' })}`;

        const button = this.renderer.createElement('button');
        this.renderer.addClass(button, 'btn');
        this.renderer.addClass(button, 'btn-outline-primary');
        this.renderer.addClass(button, 'm-1');
        this.renderer.setAttribute(button, 'id', `date-${formattedDate}`);
        this.renderer.setAttribute(button, 'data-date', formattedDate);
        this.renderer.setProperty(button, 'textContent', displayDate);
        
        const listener2 = this.renderer.listen(button, 'click', () => this.onDateClick(formattedDate));
        this.eventListeners.push(listener2);
        
        this.renderer.appendChild(dateContainer, button);
    }
  }

  onDateClick(date: string): void {
    this.dataService.getLinkedMoviesByIDDateAPI(this.id,date).subscribe({
      next:(data: LinkedMovies[]) => {
        this.linkedMovies = data;
      },
      error:(error) => {
        console.error('Error fetching linkedmovies:', error);
      }
    });
  }

  getShowTimes(jsonString: string): string[] {
  const jsonObject = JSON.parse(jsonString);
  return Object.keys(jsonObject);
  }

  filterLinkedMovies(): LinkedMovies[] {
    return this.linkedMovies.filter(lm =>
      lm.title.toLowerCase().startsWith(this.searchLM.toLowerCase())
    );
  }

  setupSeatMatrix() {
    
    const seatMatrixContainer = this.renderer.selectRootElement('.seat-grid', true);
  
    const seatRows = [
      { label: 'A', count: 10, price: 100 },
      { label: 'B', count: 10, price: 100 },
      { label: 'C', count: 10, price: 100 },
      { label: 'D', count: 10, price: 150 },
      { label: 'E', count: 10, price: 150 },
      { label: 'F', count: 10, price: 150 },
      { label: 'G', count: 10, price: 200 },
      { label: 'H', count: 10, price: 200 }
    ];
  
    let seatStringIndex = 0;
    let matrixHTML = '';
  
    seatRows.forEach(row => {
      matrixHTML += `<div class="seat-row" data-price="${row.price}"><div class="seat-label">${row.label}</div>`;
      
      for (let i = 0; i < row.count; i++) {
        const seatStatus = this.seatString[seatStringIndex++];
        const seatClass = seatStatus === '1' ? 'occupied' : 'free';
        matrixHTML += `<div class="seat ${seatClass}" data-seat-number="${row.label}${i + 1}">${i + 1}</div>`;
      }
  
      matrixHTML += '</div>';
    });
  
    this.renderer.setProperty(seatMatrixContainer, 'innerHTML', matrixHTML);
  
    // Generate seat matrix on modal load
    $('#selectionModal').on('show.bs.modal', () => {
      this.generateSeatMatrix(this.seatString);
    });
  
    // Event listener for seat selection
    seatMatrixContainer.addEventListener('click', (event) => {
      const target = event.target as HTMLElement;
      if (target.classList.contains('seat') && target.classList.contains('free')) {
        target.classList.toggle('selected');
        this.updateSeatSelection();
      }
    });
  }
  
  generateSeatMatrix(seatString: string) {
    const seatMatrixContainer = this.renderer.selectRootElement('.seat-grid', true);
    const seatRows = [
      { label: 'A', count: 10, price: 100 },
      { label: 'B', count: 10, price: 100 },
      { label: 'C', count: 10, price: 100 },
      { label: 'D', count: 10, price: 150 },
      { label: 'E', count: 10, price: 150 },
      { label: 'F', count: 10, price: 150 },
      { label: 'G', count: 10, price: 200 },
      { label: 'H', count: 10, price: 200 }
    ];
  
    let seatStringIndex = 0;
    let matrixHTML = '';
  
    seatRows.forEach(row => {
      matrixHTML += `<div class="seat-row" data-price="${row.price}"><div class="seat-label">${row.label}</div>`;
      
      for (let i = 0; i < row.count; i++) {
        const seatStatus = seatString[seatStringIndex++];
        const seatClass = seatStatus === '1' ? 'occupied' : 'free';
        matrixHTML += `<div class="seat ${seatClass}" data-seat-number="${row.label}${i + 1}">${i + 1}</div>`;
      }
  
      matrixHTML += '</div>';
    });
  
    this.renderer.setProperty(seatMatrixContainer, 'innerHTML', matrixHTML);
  }
  

  updateSeatSelection() {
    const selectedSeats = document.querySelectorAll('.seat.selected');
    const selectedSeatsArray = Array.from(selectedSeats).map(seat => seat.getAttribute('data-seat-number'));

    let totalPrice = 0;
    selectedSeats.forEach(seat => {
      const parentRow = seat.closest('.seat-row');
      const seatPrice = parentRow ? parseInt(parentRow.getAttribute('data-price') || '0', 10) : 0;
      totalPrice += seatPrice;
    });
  

    document.getElementById('selectedSeats')!.textContent = selectedSeatsArray.join(', ') || 'None';
    document.getElementById('totalPrice')!.textContent = totalPrice.toString();
    (document.getElementById('checkoutButton') as HTMLButtonElement).disabled = selectedSeats.length === 0;
    
    this.selectedSeats = document.getElementById('selectedSeats')!.textContent;
    this.totalPrice = document.getElementById('totalPrice')!.textContent;

    // Update seat string
    let seatStringArray = this.seatString.split('');
    selectedSeatsArray.forEach(seat => {
      const row = seat.charAt(0);
      const number = parseInt(seat.slice(1)) - 1;
      const rowIndex = row.charCodeAt(0) - 'A'.charCodeAt(0);
      const seatIndex = rowIndex * 10 + number;
      seatStringArray[seatIndex] = '1';
    });
    this.seatString = seatStringArray.join('');
  }

    getSeatString(movieID: string, selectedTime: string): string {

      for (const movie of this.linkedMovies) {
          if (movie.movieId === movieID ) {
              const showTimes = JSON.parse(movie.showTimes);
              if (showTimes[selectedTime]) {
                  return showTimes[selectedTime];
              }
          }
      }
      
      return "00000000000000000000000000000000000000000000000000000000000000000000000000000000";
  }
  
  checkOut() {
    $('#selectionModal').modal('hide');
  
    const stateData = {
      theatreID: this.multiplex.TheatreID,
      theatreName: this.multiplex.Name,
      theatreArea: this.multiplex.Area,
      movieName: this.movieName,
      movieId: this.movieID,
      moviePoster: this.moviePoster,
      language: this.movieLang,
      selectedDate: this.selectedDate,
      selectedTime: this.selectedTime,
      seats: this.selectedSeats,
      amount: this.totalPrice,
      seatString: this.seatString,
      screenNumber: this.screenNumber
    };
  
    this.router.navigate(['/payment'], { state: stateData });
  }
  
  setupDateAndTimeSelection() {
    let currentCard: HTMLElement | null = null;
  
    const listener = this.renderer.listen(document, 'click', (event: Event) => {
      const target = event.target as HTMLElement;
  
      // Handle date selection
      if (target.matches('.btn[data-date]')) {
        document.querySelectorAll('.btn[data-date]').forEach(btn => btn.classList.remove('active'));
        target.classList.add('active');
        this.selectedDate = target.getAttribute('data-date');
        this.isDateSelected=true;
      }
  
      // Handle time selection
      if (target.matches('.multiplex-card button[data-time]')) {
        // Reset previously selected card's time
        if (currentCard) {
          currentCard.querySelectorAll('button[data-time]').forEach(btn => btn.classList.remove('active'));
          (currentCard.querySelector('.confirm-selection') as HTMLElement).style.display = 'none';
        }
  
        // Select new card
        const card = target.closest('.multiplex-card') as HTMLElement;
        const confirmButton = card.querySelector('.confirm-selection') as HTMLElement;
  
        if (target.classList.contains('active')) {
          target.classList.remove('active');
          this.selectedTime = null;
          confirmButton.style.display = 'none';
          currentCard = null;
        } else {
          target.classList.add('active');
          this.selectedTime = target.getAttribute('data-time');
          confirmButton.style.display = 'block';
          currentCard = card;
        }
      }
  
      // Handle confirm selection
      if (target.matches('.confirm-selection')) {
        // if (!selectedDate) {
        //   alert('Please select a date.');
        //   return;
        // }

  
        if (this.selectedTime && currentCard) {
          this.movieName = currentCard.querySelector('.card-title')?.textContent;
          this.movieID = currentCard.querySelector('.movieID')?.textContent;
          this.moviePoster = currentCard.querySelector('.movie-card-img')?.getAttribute('src');
          this.screenNumber = currentCard.querySelector('.screenNumber')?.textContent;
          const area = currentCard.querySelector('.card-subtitle')?.textContent;
          this.movieLang = currentCard.querySelector('.movieLang')?.textContent;
  
          document.getElementById('selectedMultiplexName')!.textContent = this.movieName || '';
          document.getElementById('selectedArea')!.textContent = area || '';
          document.getElementById('selectedDate')!.textContent = 'Date: ' + this.selectedDate;
          document.getElementById('selectedTime')!.textContent = 'Show Time: ' + this.selectedTime;
          $('#selectionModal').modal('show');

          this.seatString = this.getSeatString(this.movieID,this.selectedTime);
          this.setupSeatMatrix();
        } 
        // else {
        //   alert('Please select a show time.');
        // }
      }
    });

    this.eventListeners.push(listener);
  
    // Reset seats and price when the modal is closed
    $('#selectionModal').on('hidden.bs.modal', () => {
      document.querySelectorAll('.seat.selected').forEach(seat => {
        seat.classList.remove('selected');
      });
      document.getElementById('selectedSeats')!.textContent = 'None';
      document.getElementById('totalPrice')!.textContent = '0';
      const checkoutButton = document.getElementById('checkoutButton') as HTMLButtonElement;
      if (checkoutButton) {
        checkoutButton.disabled = true;
      }
  
      // Reset active time selection and hide confirm button
      if (currentCard) {
        currentCard.querySelectorAll('button[data-time]').forEach(btn => btn.classList.remove('active'));
        (currentCard.querySelector('.confirm-selection') as HTMLElement)!.style.display = 'none';
      }
      this.selectedTime = null;
      currentCard = null;
    });
  }
}