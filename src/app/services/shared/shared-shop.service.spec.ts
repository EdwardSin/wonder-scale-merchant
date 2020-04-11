import { TestBed } from '@angular/core/testing';

import { SharedShopService } from './shared-shop.service';

describe('SharedShopService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: SharedShopService = TestBed.get(SharedShopService);
    expect(service).toBeTruthy();
  });
});
