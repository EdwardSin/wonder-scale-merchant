import { TestBed } from '@angular/core/testing';

import { AuthDeliveryContributorService } from './auth-delivery-contributor.service';

describe('AuthDeliveryContributorService', () => {
  let service: AuthDeliveryContributorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AuthDeliveryContributorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
