import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardMovieListComponent } from './dashboard-movie-list.component';

describe('DashboardMovieListComponent', () => {
  let component: DashboardMovieListComponent;
  let fixture: ComponentFixture<DashboardMovieListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DashboardMovieListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DashboardMovieListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
