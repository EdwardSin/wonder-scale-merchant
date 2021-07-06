import { TestBed } from '@angular/core/testing';

import { AuthOnSellingCategoryContributorService } from './auth-on-selling-category-contributor.service';

describe('AuthOnSellingCategoryContributorService', () => {
  let service: AuthOnSellingCategoryContributorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AuthOnSellingCategoryContributorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
