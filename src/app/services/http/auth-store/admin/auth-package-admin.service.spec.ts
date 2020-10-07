import { TestBed } from '@angular/core/testing';

import { AuthPackageAdminService } from './auth-package-admin.service';

describe('AuthPackageAdminService', () => {
  let service: AuthPackageAdminService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AuthPackageAdminService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
