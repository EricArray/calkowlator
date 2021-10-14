import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModifierChipComponent } from './modifier-chip.component';

describe('ModifierChipComponent', () => {
  let component: ModifierChipComponent;
  let fixture: ComponentFixture<ModifierChipComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModifierChipComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModifierChipComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
