import { TestBed } from '@angular/core/testing';

import { AuthPaymentMethodAdminService } from './auth-payment-method-admin.service';

describe('AuthPaymentMethodAdminService', () => {
  let service: AuthPaymentMethodAdminService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AuthPaymentMethodAdminService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
