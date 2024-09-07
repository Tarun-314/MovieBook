import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MulDetailsComponent } from './mul-details.component';

describe('MulDetailsComponent', () => {
  let component: MulDetailsComponent;
  let fixture: ComponentFixture<MulDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MulDetailsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MulDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
