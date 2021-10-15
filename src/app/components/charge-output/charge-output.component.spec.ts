import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChargeOutputComponent } from './charge-output.component';

describe('ChargeOutputComponent', () => {
  let component: ChargeOutputComponent;
  let fixture: ComponentFixture<ChargeOutputComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChargeOutputComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChargeOutputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
