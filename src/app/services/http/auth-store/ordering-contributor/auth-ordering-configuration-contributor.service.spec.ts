import { TestBed } from '@angular/core/testing';

import { AuthOrderingConfigurationContributorService } from './auth-ordering-configuration-contributor.service';

describe('AuthOrderingConfigurationContributorService', () => {
  let service: AuthOrderingConfigurationContributorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AuthOrderingConfigurationContributorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
