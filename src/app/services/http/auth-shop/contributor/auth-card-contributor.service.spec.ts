import { TestBed } from '@angular/core/testing';

import { AuthCardContributorService } from './auth-card-contributor.service';

describe('AuthCardContributorService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: AuthCardContributorService = TestBed.get(AuthCardContributorService);
    expect(service).toBeTruthy();
  });
});
