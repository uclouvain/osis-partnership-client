import { TestBed } from '@angular/core/testing';

import { ConfigurationService } from './configuration.service';
import { SharedModule } from '../shared.module';

describe('ConfigurationService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        SharedModule
      ]
    });
  });

  it('should be created', () => {
    const service: ConfigurationService = TestBed.get(ConfigurationService);
    expect(service).toBeTruthy();
  });
});
