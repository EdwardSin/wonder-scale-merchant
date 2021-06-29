import { TestBed } from '@angular/core/testing';

import { AuthOnSellingItemContributorService } from './auth-on-selling-item-contributor.service';

describe('AuthOnSellingItemContributorService', () => {
  let service: AuthOnSellingItemContributorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AuthOnSellingItemContributorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
