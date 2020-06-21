import { TestBed } from '@angular/core/testing';

import { AuthTrackingContributorService } from './auth-tracking-contributor.service';

describe('AuthTrackingContributorService', () => {
  let service: AuthTrackingContributorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AuthTrackingContributorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
