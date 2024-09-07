import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardLinkedMoviesComponent } from './dashboard-linked-movies.component';

describe('DashboardLinkedMoviesComponent', () => {
  let component: DashboardLinkedMoviesComponent;
  let fixture: ComponentFixture<DashboardLinkedMoviesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DashboardLinkedMoviesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DashboardLinkedMoviesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
