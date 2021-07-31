import { TestBed } from '@angular/core/testing';

import { AuthReviewContributorService } from './auth-review-contributor.service';

describe('AuthReviewContributorService', () => {
  let service: AuthReviewContributorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AuthReviewContributorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
