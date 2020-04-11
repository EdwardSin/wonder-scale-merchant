import { TestBed } from '@angular/core/testing';

import { AuthShopUserService } from './auth-shop-user.service';

describe('AuthShopUserService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: AuthShopUserService = TestBed.get(AuthShopUserService);
    expect(service).toBeTruthy();
  });
});
