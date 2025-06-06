import { Component, OnInit, AfterViewInit, ViewChild, OnDestroy } from '@angular/core';
import { Movie, Review } from '../models/data-model';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { DataService } from '../services/data-services';
import { NgForm } from '@angular/forms';
import { concatMap, of } from 'rxjs';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

declare var $: any;

@Component({
  selector: 'app-mov-details',
  templateUrl: './mov-details.component.html',
  standalone: false,
  styleUrls: ['./mov-details.component.css']
})
export class MovDetailsComponent implements OnInit, AfterViewInit, OnDestroy {

  id:string;
  movie:Movie;
  isMovPresent:boolean = false;
  trailerUrl: SafeResourceUrl;

  reviews:Review[];
  rating=0;
  comment='';
  username:string;
  msg='';
  isSuccess:boolean;
  canAddReview:boolean = false;
  isLoading:boolean =  true;
  isLoading2:boolean =  true;

  @ViewChild('f') rform:NgForm;

  constructor(private route:ActivatedRoute, private router:Router, private dataService:DataService, private sanitizer: DomSanitizer){}

  ngOnInit() {
    this.route.params.subscribe(async (params: Params) => {
        this.id = params['id'];
        if (this.id) {
            try {
                await this.dataService.fetchAndAssignMovies(); // Ensure movies are fetched first
                this.movie = this.dataService.getMovieById(this.id);
                this.trailerUrl = this.sanitizer.bypassSecurityTrustResourceUrl(this.movie.Trailer);
                this.isLoading = false;

                if (this.movie) {
                    this.isMovPresent = true;
                    await this.dataService.fetchAndAssignReviews(this.id);
                    this.dataService.reviews$.subscribe(flag => {
                        this.reviews = this.dataService.getReviews(this.id);
                        this.isLoading2=false;
                    });

                    this.dataService.canAddReview(this.id).subscribe({
                      next:(data:boolean) => {
                       this.canAddReview=data;
                      },
                      error:(error) => {
                        this.canAddReview=false;
                        console.log(error);
                      }
                    });

                } else {
                    this.router.navigate(['/error']);
                }
            } catch (error) {
                console.error('Error:', error);
                this.router.navigate(['/error']);
            }
        } else {
            this.router.navigate(['/error']);
        }
    });
    this.username=this.dataService.getUserDetails().name;
}
  

  ngAfterViewInit() {
    $('#trailerModal').on('hide.bs.modal', function () {
      const videoSrc = $('#trailerVideo').attr('src');
      $('#trailerVideo').attr('src', '');
      $('#trailerVideo').attr('src', videoSrc);
    });
  }
  ngOnDestroy(){
    $('.modal').modal('hide');
    $('.modal-backdrop').remove();
    $('body').removeClass('modal-open');
  }

  onSubmit() {
    const rev: Review = new Review(
      '', // ReviewID
      '', // UserID
      this.username, // UserName
      this.movie.MovieID, // MovieID
      Number(this.rating), // Rating
      this.comment, // Comment
      new Date() // ReviewDate
  );
  

    try {
       this.dataService.postReview(rev).subscribe({
        next:(data:any) => {
          this.msg = 'Review added successfully.';
          this.dataService.pushReview(rev);
          this.reviews = this.dataService.getReviews(this.movie.MovieID);
        },
        error:(error) => {
          if(error.message="DUP")
            this.msg="Your review is already added."
          else
            this.msg="Failed. Review is not added.";
          console.log(error);
        }
      });
      
      
      this.rform.reset();
      this.rating = 0;
      this.comment = '';
      this.msg='';
    } catch (e) {
      this.msg = `Error: ${e.message}`;
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
}
