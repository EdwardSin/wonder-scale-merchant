import { TestBed } from '@angular/core/testing';

import { ShopAuthorizationService } from './shop-authorization.service';

describe('ShopAuthorizationService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ShopAuthorizationService = TestBed.get(ShopAuthorizationService);
    expect(service).toBeTruthy();
  });
});
