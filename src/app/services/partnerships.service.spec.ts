import { TestBed } from '@angular/core/testing';

import { PartnershipsService } from './partnerships.service';

describe('PartnershipsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: PartnershipsService = TestBed.get(PartnershipsService);
    expect(service).toBeTruthy();
  });
});
