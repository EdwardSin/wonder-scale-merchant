import { TestBed } from '@angular/core/testing';

import { AuthStoreAdminService } from './auth-store-admin.service';

describe('AuthStoreAdminService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: AuthStoreAdminService = TestBed.get(AuthStoreAdminService);
    expect(service).toBeTruthy();
  });
});
