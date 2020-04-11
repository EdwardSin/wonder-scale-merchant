import { TestBed } from '@angular/core/testing';

import { AuthDefaultSettingAdminService } from './auth-default-setting-admin.service';

describe('AuthDefaultSettingAdminService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: AuthDefaultSettingAdminService = TestBed.get(AuthDefaultSettingAdminService);
    expect(service).toBeTruthy();
  });
});
