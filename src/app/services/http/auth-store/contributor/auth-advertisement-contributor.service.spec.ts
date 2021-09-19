import { TestBed } from '@angular/core/testing';

import { AuthAdvertisementContributorService } from './auth-advertisement-contributor.service';

describe('AuthAdvertisementContributorService', () => {
  let service: AuthAdvertisementContributorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AuthAdvertisementContributorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
