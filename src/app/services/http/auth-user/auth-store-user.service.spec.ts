import { TestBed } from '@angular/core/testing';

import { AuthStoreUserService } from './auth-store-user.service';

describe('AuthStoreUserService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: AuthStoreUserService = TestBed.get(AuthStoreUserService);
    expect(service).toBeTruthy();
  });
});
