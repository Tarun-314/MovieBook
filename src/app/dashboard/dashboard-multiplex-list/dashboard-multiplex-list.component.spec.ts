import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardMultiplexListComponent } from './dashboard-multiplex-list.component';

describe('DashboardMultiplexListComponent', () => {
  let component: DashboardMultiplexListComponent;
  let fixture: ComponentFixture<DashboardMultiplexListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DashboardMultiplexListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DashboardMultiplexListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
