import { TestBed } from '@angular/core/testing';

import { AuthItemContributorService } from './auth-item-contributor.service';

describe('AuthItemContributorService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: AuthItemContributorService = TestBed.get(AuthItemContributorService);
    expect(service).toBeTruthy();
  });
});
