import { TestBed } from '@angular/core/testing';

import { AuthShopAdminService } from './auth-shop-admin.service';

describe('AuthShopAdminService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: AuthShopAdminService = TestBed.get(AuthShopAdminService);
    expect(service).toBeTruthy();
  });
});
