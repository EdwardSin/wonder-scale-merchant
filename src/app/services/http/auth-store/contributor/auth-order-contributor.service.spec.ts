import { TestBed } from '@angular/core/testing';

import { AuthOrderContributorService } from './auth-order-contributor.service';

describe('AuthOrderContributorService', () => {
  let service: AuthOrderContributorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AuthOrderContributorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
