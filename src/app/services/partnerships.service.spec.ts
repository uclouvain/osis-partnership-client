import { TestBed } from '@angular/core/testing';

import { PartnershipsService } from './partnerships.service';
import { SharedModule } from '../shared.module';

describe('PartnershipsService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        SharedModule
      ]
    });
  });

  it('should be created', () => {
    const service: PartnershipsService = TestBed.get(PartnershipsService);
    expect(service).toBeTruthy();
  });
});
