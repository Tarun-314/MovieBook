import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MultiplexComponent } from './multiplex.component';

describe('MultiplexComponent', () => {
  let component: MultiplexComponent;
  let fixture: ComponentFixture<MultiplexComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MultiplexComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MultiplexComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
