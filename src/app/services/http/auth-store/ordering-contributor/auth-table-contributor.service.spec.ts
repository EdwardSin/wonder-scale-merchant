import { TestBed } from '@angular/core/testing';

import { AuthTableContributorService } from './auth-table-contributor.service';

describe('AuthTableContributorService', () => {
  let service: AuthTableContributorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AuthTableContributorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
