import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardUserBookingsComponent } from './dashboard-user-bookings.component';

describe('DashboardUserBookingsComponent', () => {
  let component: DashboardUserBookingsComponent;
  let fixture: ComponentFixture<DashboardUserBookingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DashboardUserBookingsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DashboardUserBookingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
