import { TestBed } from '@angular/core/testing';

import { AuthReceiptContributorService } from './auth-receipt-contributor.service';

describe('AuthReceiptContributorService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: AuthReceiptContributorService = TestBed.get(AuthReceiptContributorService);
    expect(service).toBeTruthy();
  });
});
