import { TestBed } from '@angular/core/testing';

import { AuthTrackContributorService } from './auth-track-contributor.service';

describe('AuthTrackContributorService', () => {
  let service: AuthTrackContributorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AuthTrackContributorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
