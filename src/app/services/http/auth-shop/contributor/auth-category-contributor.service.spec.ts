import { TestBed } from '@angular/core/testing';

import { AuthCategoryContributorService } from './auth-category-contributor.service';

describe('AuthCategoryContributorService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: AuthCategoryContributorService = TestBed.get(AuthCategoryContributorService);
    expect(service).toBeTruthy();
  });
});
