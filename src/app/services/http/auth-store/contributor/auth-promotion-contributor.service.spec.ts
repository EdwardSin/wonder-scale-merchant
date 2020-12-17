import { TestBed } from '@angular/core/testing';

import { AuthPromotionContributorService } from './auth-promotion-contributor.service';

describe('AuthPromotionContributorService', () => {
  let service: AuthPromotionContributorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AuthPromotionContributorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
