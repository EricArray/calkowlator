import { TestBed } from '@angular/core/testing';

import { FactionsService } from './factions.service';

describe('FactionsService', () => {
  let service: FactionsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FactionsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
