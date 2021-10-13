import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChargeInputComponent } from './charge-input.component';

describe('ChargeInputComponent', () => {
  let component: ChargeInputComponent;
  let fixture: ComponentFixture<ChargeInputComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChargeInputComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChargeInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
