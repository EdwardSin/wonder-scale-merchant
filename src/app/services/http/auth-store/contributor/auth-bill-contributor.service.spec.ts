import { TestBed } from '@angular/core/testing';

import { AuthBillContributorService } from './auth-bill-contributor.service';

describe('AuthBillContributorService', () => {
  let service: AuthBillContributorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AuthBillContributorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
